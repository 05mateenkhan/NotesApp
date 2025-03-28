
module.exports.homepage = async (req,res) => {
    const locals = {
        title: 'MyNotesApp',
        description: 'NodeJs App for Notes'
    }
    res.render('index', {
        locals,
        layout: '../views/layouts/front-page'
    })
}
module.exports.about = async (req,res) => {
    // console.log(req.user)
    const locals = {
        title: 'AboutMyNotesApp',
        description: 'About Section of NodeJs App for Notes'
    }
    res.render('about', locals)
}