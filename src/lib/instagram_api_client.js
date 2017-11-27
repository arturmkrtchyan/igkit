class InstagramApiClient {

    constructor() {
        this.pictures = [];
    }

    async getPictures(profileUrl, limit) {

        if(JSON.stringify(this.pictures) != JSON.stringify([])) {
            return this.pictures;
        }

        let pictures = [];
        let nextId = '';
        let running = true;

        while(running) {
            let profile = await this.__getPictures(profileUrl + '?__a=1&max_id=' + nextId); 
            let media = await this.__extractMedia(profile);
            this.pictures = this.pictures.concat(media.pictures);

            if(media.hasNext && this.pictures.length < limit) {
                nextId = media.nextId;
            } else {
                running = false;
            }
        }
        console.log(this.pictures);
        return this.pictures;
    }
    
    __getPictures(profileUrl) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: profileUrl,
                type: 'GET',
                success: (response) => {
                    resolve(response);
                },
                error: (err) => {
                    reject(err);
                }
            });
        })
    }
    
    __extractMedia(profile) {
        return new Promise((resolve, reject) => {
            let images = [];
            let imgageNodes = profile.user.media.nodes.filter(node => node.__typename == 'GraphImage');
    
            imgageNodes.forEach((image, index) => {
                images.push({
                    thumbnail_src: image.thumbnail_src,
                    display_src: image.display_src
                });
                if(imgageNodes.length == images.length) {
                    resolve({
                        pictures: images,
                        hasNext: profile.user.media.page_info.has_next_page, 
                        nextId: profile.user.media.page_info.end_cursor
                    });
                }
            });
        });
    }

}
