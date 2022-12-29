const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

require("../models/Artigo")
const {error, server, database} = require("../helpers/HMessages");
const artigos = mongoose.model("artigos")

router.get("/", (req, res) => {
    artigos.find().lean().then((result) => {
        server("todos os artigos foram carregados com sucesso.")
        res.render("client/home", { artigos: result, titulo: "Home" })
    }).catch(err => {
        error(err)
        req.flash('error_msg', 'Um erro ocorreu, tente novamente mais tarde.')
        res.redirect("/")
    })
})

router.get("/article/:slug", (req, res) => {
    artigos.findOne({slug: req.params.slug}).lean().then(result => {
        server("artigo carregado com sucesso.")
        res.render("client/article", { artigo: result, titulo: `Visualizar ${result.title}` })
    }).catch(err => {
        error(err)
        req.flash('error_msg', 'Um erro ocorreu, tente novamente mais tarde.')
        res.redirect("/")
    })
})

router.get("/create", (req, res) => {
    res.render("client/create", { titulo: "Criar"})
})
router.post("/service/create", (req, res) => {
    new artigos({
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        author: req.body.author
    }).save().then(() => {
        database("o artigo foi criado com sucesso.")
        req.flash('success_msg', 'O artigo foi salvo com sucesso.')
        res.redirect("/")
    }).catch(err => {
        error(err)
        req.flash('error_msg', 'Um erro ocorreu, tente novamente mais tarde.')
        res.redirect("/")
    })
})

router.post("/delete/:id", (req, res) => {
    artigos.remove({ _id: req.params.id }).then(() => {
        req.flash('success_msg', `O artigo foi removido com sucesso: ${req.params.id}`)
        res.redirect("/")
    }).catch(err => {
        error("ocorreu um erro durante a exclusão do artigo: " + err)
        req.flash('error_msg', 'Ocorreu um erro durante a exclusão do artigo: ' + req.params.id)
        res.redirect("/")
    })
})

router.get("/edit/:id", (req, res) => {
    artigos.findOne({_id: req.params.id}).lean().then(result => {
        res.render("client/edit", {artigo: result, titulo: `Editar ${result.title}`})
    }).catch(err => {
        error("ocorreu um erro durante o carregamento do artigo: " + err)
        req.flash('error_msg', 'Ocorreu um erro durante o carregamento do artigo: ' + req.params.id)
        res.redirect("/")
    })
})
router.post("/service/edit", (req, res) => {
    artigos.findById(req.body._id).then(result => {
        result.title = req.body.title;
        result.slug = req.body.slug;
        result.content = req.body.content;
        result.author = req.body.author;

        result.save().then(() => {
            req.flash('success_msg', `O artigo foi editado com sucesso: ${req.body._id}`)
            res.redirect("/")
        }).catch(err => {
            error("ocorreu um erro durante o salvamento do artigo: " + err)
            req.flash('error_msg', 'Ocorreu um erro durante o salvamento do artigo: ' + req.body._id)
            res.redirect("/")
        })
    }).catch(err => {
        error("ocorreu um erro durante o salvamento do artigo: " + err)
        req.flash('error_msg', 'Ocorreu um erro durante o salvamento do artigo: ' + req.body._id)
        res.redirect("/")
    })
})

module.exports = router;