const Note = require('../models/note')
const mongoose = require('mongoose')
module.exports.dashboard = async (req, res) => {
    // try {
    //     await Note.insertMany([
    //         {
    //             user: '67e4c8bccb5ca065dec7729f',
    //             title: 'Demo',
    //             body: 'Welcome to the free notes app.',
    //             createdAt: '1671634422539'
    //         },
    //         {
    //             user: '67e4c8bccb5ca065dec7729f',
    //             title: 'Demo1',
    //             body: 'Welcome to the free notes app.',
    //             createdAt: '1671634422539'
    //         },
    //         {
    //             user: '67e4c8bccb5ca065dec7729f',
    //             title: 'Demo2',
    //             body: 'Welcome to the free notes app.',
    //             createdAt: '1671634422539'
    //         },
    //         {
    //             user: '67e4c8bccb5ca065dec7729f',
    //             title: 'Demo3',
    //             body: 'Welcome to the free notes app.',
    //             createdAt: '1671634422539'
    //         },
    //         {
    //             user: '67e4c8bccb5ca065dec7729f',
    //             title: 'Demo4',
    //             body: 'Welcome to the free notes app.',
    //             createdAt: '1671634422539'
    //         },
    //         {
    //             user: '67e4c8bccb5ca065dec7729f',
    //             title: 'Demo5',
    //             body: 'Welcome to the free notes app.',
    //             createdAt: '1671634422539'
    //         },
    //         {
    //             user: '67e4c8bccb5ca065dec7729f',
    //             title: 'Demo6',
    //             body: 'Welcome to the free notes app.',
    //             createdAt: '1671634422539'
    //         },
    //     ])
    // }
    // catch (e) {
    //     console.log(e)
    // }
    let perPage = 12;
    let page = req.query.page || 1;
    const locals = {
        title: 'DashBoard',
        description: 'NodeJs App for Notes',
    };
    try {
        // const notes = await Note.find({});
        const notes = await Note.aggregate([
            { $sort: { updatedAt: -1 } },
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $project: {
                    title: { $substr: ["$title", 0, 30] },
                    body: { $substr: ["$body", 0, 100] },
                },
            },
        ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const count = await Note.countDocuments();
        res.render('dashboard/index', {
            userName: req.user.username,
            locals,
            notes,
            layout: '../views/layouts/dashboard',
            current: page,
            pages: Math.ceil(count / perPage)
        });
    }
    catch (e) {
        console.log(e);
    }
}
module.exports.showNote = async (req, res) => {
    const noteId = req.params.id;
    const note = await Note.findById(req.params.id)
    // .where({user: req.user.id}).lean();
    console.log(note.body)
    console.log(note.title)

    if (note) {
        res.render('dashboard/viewNote', {
            noteId,
            note
        })
    }
    else {
        res.send('Something went wrong')
    }
}
module.exports.updateNode = async (req, res) => {
    try {
        await Note.findOneAndUpdate(
            { _id: req.params.id },
            { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
        ).where({ user: req.user.id });

        res.redirect(`/dashboard/item/${req.params.id}`)
    }
    catch (e) {
        console.log(e);
    }
}
module.exports.deleteNote = async (req, res) => {
    try {
        const id = req.params.id;
        await Note.deleteOne({ _id: id, user: req.user.id });
        res.redirect('/dashboard')
    }
    catch (e) {
        console.log(e)
        console.log(req.params);
    }
}
module.exports.addNoteForm = async (req, res) => {
    res.render('dashboard/newNote')
}
module.exports.addNote = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const note = new Note({
            title: req.body.title,
            body: req.body.body,
            user: req.body.user,
            updatedAt: Date.now()
        })
        await note.save();
        res.redirect(`/dashboard/item/${note.id}`);
    }
    catch (e) {
        console.log(e);
    }
}
module.exports.dashboardSearch = async (req, res) => {
    try {
        res.render('dashboard/search',{
            searchResults: ''
        })
    }
    catch (e) {
        console.log(e);
    }
}
module.exports.dashboardSearchSubmit = async (req,res) => {
    try {
        let searchTerm = await req.body.searchItem;
        // console.log(req.body);
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-z0-9 ]/g, "");
        const searchResults = await Note.find({
            $or: [
                {title: { $regex: new RegExp(searchNoSpecialChars, 'i')}},
                {body: { $regex: new RegExp(searchNoSpecialChars, 'i')}}
            ]
        }).where({user: req.user.id})

        res.render('dashboard/search', {
            searchResults
        })
    }
    catch(e) {
        console.log(e);
    }
}