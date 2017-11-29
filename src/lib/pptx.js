class Pptx {

    static create(creator, context) {
        console.log(creator);
        // Create a new Presentation
        var pptx = new PptxGenJS();
        pptx.setLayout('LAYOUT_WIDE');

        // Add a Slide, then add objects
        var slide = pptx.addNewSlide();
        
        
        // Name
        slide.addText(creator.name.toUpperCase(), { x:8.95, y:1.35, font_size:24, font_face:'Lato', color:'000000' });
        slide.addImage({ path: 'path.svg', x:8.98, y:1.15, w:0.02, h:0.8 });


        
        slide.addText('Profile', { x:7.85, y:2.55, font_size:24, font_face:'Lato', bold: true, color:'000000'});
        
        slide.addText('Instagram:', { x:8.97, y:2.55, font_size:13.3, font_face:'Lato', bold: true, color:'000000'});
        slide.addText('@' + creator.channelName, { x:9.93, y:2.55, font_size:13.3, font_face:'Lato', color:'000000'});
        slide.addText('Location:', { x:8.97, y:2.90, font_size:13.3, font_face:'Lato', bold: true, color:'000000'});
        slide.addText(creator.location, { x:9.80, y:2.90, font_size:13.3, font_face:'Lato', color:'000000'});
        slide.addText('Age:', { x:8.97, y:3.25, font_size:13.3, font_face:'Lato', bold: true, color:'000000'});
        slide.addText(creator.age, { x:9.40, y:3.25, font_size:13.3, font_face:'Lato', color:'000000'});
        slide.addText('Followers Instagram:', { x:8.97, y:3.60, font_size:13.3, font_face:'Lato', bold: true, color:'000000'});
        slide.addText(creator.instagramFollowers, { x:10.73, y:3.60, font_size:13.3, font_face:'Lato', color:'000000'});
        slide.addText('Engagement Instagram:', { x:8.97, y:3.95, font_size:13.3, font_face:'Lato', bold: true, color:'000000'});
        slide.addText(creator.instagramEngagement + '%', { x:10.95, y:3.95, font_size:13.3, font_face:'Lato', color:'000000'});
        slide.addText('Channels:', { x:8.97, y:4.30, font_size:13.3, font_face:'Lato', bold: true, color:'000000'});
        slide.addText(creator.channels, { x:9.84, y:4.30, font_size:13.3, font_face:'Lato', color:'000000'});

        slide.addImage({ path: 'path.svg', x:8.98, y:2.5, w:0.02, h:2.5 });
        
        // Images: Using local images sources (same paths as you would use in an {img src=""} tag)
        slide.addImage({ path: 'collabary_logo_dark.svg', x:2.0, y:5.8, w:2.82, h:0.76 });

        console.log('File Path: ' + creator.imageA);
        
        slide.addImage({path: 'file://' + creator.imageA, x:0, y:0, w:2.85, h:5.09});
        slide.addImage({path: 'file://' + creator.imageB, x:2.85, y:0, w:2.53, h:2.53});
        slide.addImage({path: 'file://' + creator.imageC, x:2.85, y:2.56, w:2.53, h:2.53});
        
        slide.addImage({path: 'file://' + creator.imageD, x:5.965, y:5.105, w:2.4, h:2.4});
        slide.addImage({path: 'file://' + creator.imageE, x:8.45, y:5.105, w:2.4, h:2.4});
        slide.addImage({path: 'file://' + creator.imageF, x:10.935, y:5.105, w:2.4, h:2.4});
        
        // Export Presentation
        pptx.save(creator.name);

        return creator;
    }
}