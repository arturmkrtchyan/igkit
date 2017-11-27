class Pptx {

    static create(creator, context) {
        console.log(creator);
        // Create a new Presentation
        var pptx = new PptxGenJS();
        pptx.setLayout('LAYOUT_WIDE');

        // Add a Slide, then add objects
        var slide = pptx.addNewSlide();
        slide.addText('Welcome ' + creator.name, { x:6.5, y:2.25, font_size:18, font_face:'Arial', color:'000000' });

        // Images: Using local images sources (same paths as you would use in an {img src=""} tag)
        slide.addImage({ path: 'collabary_logo_dark.svg', x:2.0, y:5.8, w:2.82, h:0.76 });

        
        slide.addImage({path: 'file://' + creator.imageA, x:0, y:0, w:2.85, h:5.09});
        slide.addImage({path: 'file://' + creator.imageB, x:2.85, y:0, w:2.54, h:2.54});
        slide.addImage({path: 'file://' + creator.imageC, x:2.85, y:2.54, w:2.54, h:2.54});
        
        slide.addImage({path: 'file://' + creator.imageD, x:6.135, y:5.105, w:2.4, h:2.4});
        slide.addImage({path: 'file://' + creator.imageE, x:8.535, y:5.105, w:2.4, h:2.4});
        slide.addImage({path: 'file://' + creator.imageF, x:10.935, y:5.105, w:2.4, h:2.4});
        
        // Export Presentation
        pptx.save(creator.name);

        return creator;
    }
}