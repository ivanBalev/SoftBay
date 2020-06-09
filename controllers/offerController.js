const offerController = function () {

    const validateUrl = function (str) {
        var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        return str.match(regex);
    }

    const validateInput = function (context) {
        let isValid = context.params.product !== '' &&
            context.params.description !== '' &&
            context.params.price !== '' &&
            validateUrl(context.params.pictureUrl);

        return isValid;
    }

    const getCreateOffer = function (context) {

        helper.setHeaderView(context);
        helper.loadPartials(context)
            .then(function () {
                this.partial('./views/offers/create.hbs')
            })

    }

    const postCreateOffer = function (context) {

        helper.notify('loading', 'Loading...');

        if (validateInput(context)) {

            const data = {
                ...context.params,
                creator: sessionStorage.getItem('username'),
            }

            requester.post('offers', 'appdata', 'Kinvey', data)
                .then(helper.handler)
                .then(() => {

                    helper.stopNotification();
                    helper.notify('success', 'You have successfully created an offer.');

                    context.redirect('#/dashboard');
                })
        } else {
            helper.stopNotification();
            helper.notify('error', 'Invalid data. Please try again.');
        }
    }

    const getDashboard = function (context) {
        requester.get('offers', 'appdata', 'Kinvey')
            .then(helper.handler)
            .then((data) => {
                data.forEach(d => {
                    d.isCreator = sessionStorage.getItem('username') === d.creator;
                });

                context.offers = data;
                helper.setHeaderView(context);

                helper.loadPartials(context, {
                    noOffers: './views/offers/noOffers.hbs',
                    singleOffer: './views/offers/singleOffer.hbs'
                })
                    .then(function () {
                        this.partial('./views/offers/dashboard.hbs')
                    });
            })
    }


    const showDetails = function (context) {

        requester.get(`offers/${context.params.id}`, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then((offer) => {
                helper.setHeaderView(context);

                context.offer = offer;

                helper.loadPartials(context)
                    .then(function () {
                        this.partial('./views/offers/details.hbs')
                    })
            })
    }

    const getEditOffer = function (context) {

        requester.get(`offers/${context.params.id}`, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then(offer => {
                helper.setHeaderView(context);
                context.offer = offer;

                helper.loadPartials(context)
                    .then(function () {
                        this.partial('./views/offers/edit.hbs')
                    })
            });
    }

    const postEditOffer = function (context) {

        const id = context.params.id;
        delete context.params.id;

        const data = {
            ...context.params,
            creator: sessionStorage.getItem('username'),
        }

        helper.notify('loading', 'Loading...');

        if (validateInput(context)) {
            requester.put(`offers/${id}`, 'appdata', 'Kinvey', data)
                .then(helper.handler)
                .then(() => {
                    helper.stopNotification();
                    helper.notify('success', 'You have successfully edited this offer.');

                    context.redirect('#/dashboard');
                })
        } else {
            helper.notify('error', 'Invalid data. Please try again.');
        }

    }

    const getDeleteOffer = function (context) {

        requester.get(`offers/${context.params.id}`, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then(offer => {
                helper.setHeaderView(context);
                context.offer = offer;

                helper.loadPartials(context)
                    .then(function () {
                        this.partial('./views/offers/delete.hbs')
                    })
            });
    }

    const postDeleteOffer = function (context) {
        const id = context.params.id;

        helper.notify('loading', 'Loading...');

        requester.del(`offers/${id}`, 'appdata', 'Kinvey')
            .then(helper.handler)
            .then(() => {
                helper.stopNotification();
                helper.notify('success', 'You have successfully deleted this offer.');

                context.redirect('#/dashboard')
            })
    }

    return {
        getCreateOffer,
        postCreateOffer,
        getDashboard,
        showDetails,
        getEditOffer,
        postEditOffer,
        postDeleteOffer,
        getDeleteOffer,
    }
}();