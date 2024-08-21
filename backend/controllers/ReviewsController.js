import ReviewsModel from "../models/Reviews.js"


// Get all tasks
export const getReviews = async (req, res) => {
    try{
        const reviews = await ReviewsModel.find();
        res.status(201).json(reviews);
    }catch( err){
        res.status(404).json(err)
    }
}

// Save data of the task in the database
export const saveReviews = async (req, res) => {
    const review = req.body;
    
    const newReview = new ReviewsModel(review);
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