import express from 'express';
import { 
  getReviews, 
  createReview, 
  deleteReview 
} from '../api/reviews.js';

const router = express.Router();

// Get all reviews for a product
router.get('/', getReviews);

// Create a new review
router.post('/', createReview);

// Delete a review
router.delete('/:id', deleteReview);

export default router;
