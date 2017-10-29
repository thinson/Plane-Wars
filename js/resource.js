var resourceHelper = {
    imageLoader: function(src,callback) {
        var image = new Image();

        image.addEventListener('load',callback);
        image.addEventListener('error',function(){
            alert('error');
        });
        image.src = src;
        return image;
    },

    getImage: function(imageName) {
        return this.resources.images[imageName];
    },

    load: function(resources,callback) {
        var images = resources.images;
        var sounds = resources.sounds;
        var total = images.length;
        var finish = 0;
        this.resources = {
            images:{},
            sounds:{},
        };
        var self = this;

        for(var i = 0;i< images.length;i++) {
            var name = images[i].name;
            var src = images[i].src;
            self.resources.images[name] = self.imageLoader(src,function() {
                finish++;
                if( finish == total) {
                    callback(self.resources)
                }
            });
        }
    }
}