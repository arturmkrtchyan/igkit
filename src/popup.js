$(function() {
    console.log('Initializing App.');
    const instagramApi = new InstagramApiClient();
    const context = new Context();
    const app = new App(context);

    context.addAttribute('instagramApi', instagramApi);

    app.render();
});



class Context {
    constructor() {
        this.attributes = {};
    }

    addAttribute(name, value) {
        this.attributes[name] = value;
    }

    removeAttribute(name) {
        delete this.attributes[name];
    }

    getAttribute(name) {
        return this.attributes[name];
    }
}

class App {

    constructor(context) {
        this.context = context;
        context.addAttribute('app', this);
        context.addAttribute('profile', {});
    }

    render() {
        var app = this;
        console.log('Check if the page is collabary creator profile.');
        this.isCollabaryProfilePage().then((result) => {
            
             if(result) {
                 $('div.container').removeClass('hidden');
                 console.log('Get Collabary creator profile.');
                 app.getCollabaryProfile().then(profile => {
                     console.log('Collabary Profile: ' + JSON.stringify(profile));
                     TemplateComponent.render(this.context, profile);
                     
                     $("#btn-generate-ppt").click(() => {
                         app.createPpt();
                     });
                 });
             } else {
                 iziToast.show({
                     title: 'Hey',
                     message: 'This is not a Collabary Creator Profile Page!',
                     position: 'topCenter',
                     color: 'red',
                     timeout: 60000,
                     progressBar: false
                 });
             }
     
         });
    }

    async getCollabaryProfile() {
        if(JSON.stringify(this.context.getAttribute('profile')) === JSON.stringify({})) {
            this.context.addAttribute('profile', await this.__getProfile());
        }
        return this.context.getAttribute('profile');
    }

    async isCollabaryProfilePage() {
        const url = await ChromeApiClient.getCurrentPageUrl();
        console.log('Current Page Location: ' + JSON.stringify(url));
        return url && CollabaryApiClient.isCollabaryProfilePage(url.href);
    }

    createPpt() {
        const context = this.context;
        const profile = context.getAttribute('profile');

        Promise.all([
            ChromeApiClient.download(context.getAttribute('img-a'), ChromeApiClient.randomFileName('jpg')),
            ChromeApiClient.download(context.getAttribute('img-b'), ChromeApiClient.randomFileName('jpg')),
            ChromeApiClient.download(context.getAttribute('img-c'), ChromeApiClient.randomFileName('jpg')),
            ChromeApiClient.download(context.getAttribute('img-d'), ChromeApiClient.randomFileName('jpg')),
            ChromeApiClient.download(context.getAttribute('img-e'), ChromeApiClient.randomFileName('jpg')),
            ChromeApiClient.download(context.getAttribute('img-f'), ChromeApiClient.randomFileName('jpg'))
        ]).then((files) => {
            async function generatePpt() {
                Pptx.create({
                    name: profile.name,
                    imageA: files[0],
                    imageB: files[1],
                    imageC: files[2],
                    imageD: files[3],
                    imageE: files[4],
                    imageF: files[5],
                    channelName: CollabaryApiClient.extractInstagramUserName(profile),
                    location: profile.locations[0].city,
                    age: profile.influencer_age,
                    instagramFollowers: CollabaryApiClient.extractInstagramFollowers(profile),
                    instagramEngagement: CollabaryApiClient.extractInstagramEngagement(profile),
                    channels: CollabaryApiClient.getChannelNames(profile)
                });
            }
            generatePpt().then(result => {
            });
            
        });
    }

    setActivedTemplateElement(activedTemplateElement) {
        this.activedTemplateElement = activedTemplateElement;
    }

    getActivedTemplateElement() {
        return this.activedTemplateElement;
    }

    // private
    async __getProfile() {
        const url = await ChromeApiClient.getCurrentPageUrl();
        const profileId = CollabaryApiClient.extractProfileId(url.href);
        
        console.log('Collabary Profile Id: ' + profileId);

        const accessTokenCookie = await ChromeApiClient.readCookie('https://app.collabary.com', 'accessToken');

        console.log('Collabary Access Token: ' + JSON.stringify(accessTokenCookie));

        const profile = await CollabaryApiClient.getCreator(profileId, accessTokenCookie.value);
        return profile;
    }
}







////// UI Components //////

class ModalComponent {
    static setup(context, options) {
        $("#modal").iziModal({
            top: 50,
            bottom: 50,
            closeButton: true,
            title: 'Instagram Images',
            onOpening: options.onOpening,
            onOpened: options.onOpened
        });
        options.triggerElement.click((event) => {
            event.preventDefault();
            context.addAttribute('activedTemplateElement', event.currentTarget);
            $("#modal").iziModal('resetContent');
            $("#modal").iziModal('open');
        });
    }

    static open() {
        $("#modal").iziModal('resetContent');
        $("#modal").iziModal('open');
    }

    static close() {
        $("#modal").iziModal('close');
    }
}

class SpinnerComponent {
    static appendLoader(container) {
        $(container).empty();
        $(container).append(`
            <div class="sk-cube-grid">
                <div class="sk-cube sk-cube1"></div>
                <div class="sk-cube sk-cube2"></div>
                <div class="sk-cube sk-cube3"></div>
                <div class="sk-cube sk-cube4"></div>
                <div class="sk-cube sk-cube5"></div>
                <div class="sk-cube sk-cube6"></div>
                <div class="sk-cube sk-cube7"></div>
                <div class="sk-cube sk-cube8"></div>
                <div class="sk-cube sk-cube9"></div>
            </div>
        `);
    }

    static removeLoader(container) {
        $(container).empty();
    }
}

class ProfileComponent {
    
    static render(profile) {        
        $('.profile-container .profile-name').html(profile.name.toUpperCase());
        $('.profile-details .instagram-channel-name').html('Instagram: @' + CollabaryApiClient.extractInstagramUserName(profile));
        $('.profile-details .location').html('Location: ' + profile.locations[0].city);
        $('.profile-details .age').html('Age: ' + profile.influencer_age);
        $('.profile-details .instagram-followers')
            .html('Followers Instagram: ' + CollabaryApiClient.extractInstagramFollowers(profile));
        $('.profile-details .instagram-engagement')
            .html('Instagram Engagement: ' + CollabaryApiClient.extractInstagramEngagement(profile) + '%');
        $('.profile-details .channels').html('Channels: ' + CollabaryApiClient.getChannelNames(profile));
    }
}

class TemplateComponent {
    static render(context, profile) {
        console.log('Rendering template.');
        ProfileComponent.render(profile);
        ModalComponent.setup(context, {
            triggerElement: $('.change-me'),
            onOpening: () => {
                SpinnerComponent.appendLoader($('#ig-img-container'));
            },
            onOpened: () => { 
                TemplateComponent.onModalOpen(context); 
            }
        });
    }

    static onModalOpen(context) {
        const instagramUserName = CollabaryApiClient.extractInstagramUserName(context.getAttribute('profile'));
        console.log('Get post pictures from instagram.');
        context.getAttribute('instagramApi').getPictures('https://www.instagram.com/' + instagramUserName, 100).then((images) => {
            SpinnerComponent.removeLoader($('#ig-img-container'));
            images.forEach((image) => {
                $('#ig-img-container').append(`<img src="${image.thumbnail_src}">`);
            });

            $('#ig-img-container img').dblclick(function() {
                let src = $(this).attr('src');
                const imgContainer = $(context.getAttribute('activedTemplateElement'));
                const img = imgContainer.find('img');

                ModalComponent.close();

                if(imgContainer.hasClass('img-a')) {
                    const fetchUrl = 'http://res.cloudinary.com/collabary/image/fetch/c_crop,g_auto,h_509,w_285/';
                    src = fetchUrl + src;
                }
                
                img.attr('src', src);
                img.removeClass('hidden');
                context.addAttribute(imgContainer.attr('id'), src);

                imgContainer.find('span').addClass('hidden');
            });
        });
    }
}