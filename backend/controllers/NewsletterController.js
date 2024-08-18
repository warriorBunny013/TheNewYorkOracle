import NewsletterModel from "../models/Newsletter.js"

// Get all tasks
export const getNewsletterModel = async (req, res) => {
    try{
        const Newsletter = await NewsletterModel.find();
        res.status(200).json(Newsletter);
    }catch(err){
        res.status(404).json(err)
    }
}

// Save data of the task in the database
export const saveNewsletter = async (req, res) => {
    const Newsletter = req.body;
    
    const newNewsletter = new NewsletterModel(review);
    try{
        await newReview.save();
        res.status(201).json(newReview);
    } catch (err){
        res.status(409).json(err);     
    }
}





// deleting data of tasks from the database
export const deleteReview = async (req, res) => {
   try{
      await ReviewsModel.findByIdAndDelete(req.params.id);
      res.status(200).json("Review has been deleted");
    }catch(err){
    res.status(500).json(err)
}
}