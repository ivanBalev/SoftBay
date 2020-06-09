const homeController = function () {

    const getHome = function (context) {

        helper.setHeaderView(context);
        helper.loadPartials(context)
            .then(function () {
                this.partial('../views/home/homePage.hbs')
            });
    }

    return {
        getHome
    }
}();