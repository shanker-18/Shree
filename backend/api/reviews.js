import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (reuse env vars, with safe defaults)
const supabaseUrl = process.env.SUPABASE_URL || 'https://vxlldtzcedpmwxwszpvk.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bGxkdHpjZWRwbXd4d3N6cHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NDA2MjEsImV4cCI6MjA3MTQxNjYyMX0.KxOz_sGQAg5fECqHZpzsD0QUFwa4GCFxXGIs00hDU6Y';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET /api/reviews?productName=Turmeric%20Powder
export async function getReviews(req, res) {
  try {
    const { productName } = req.query;

    if (!productName) {
      return res.status(400).json({
        success: false,
        message: 'productName query parameter is required',
      });
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('productname', productName)
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ Supabase getReviews error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch reviews',
      });
    }

    // Map DB columns (productname, useremail, ...) to frontend shape
    const mapped = (data || []).map((row) => ({
      id: row.id,
      product_name: row.productname,
      user_email: row.useremail,
      rating: row.rating,
      comment: row.comment,
      created_at: row.created_at,
    }));

    // Frontend expects `data` field containing the array
    return res.status(200).json({
      success: true,
      count: mapped.length,
      data: mapped,
    });
  } catch (err) {
    console.error('❌ getReviews unexpected error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
}

// POST /api/reviews
// Body from frontend: { product_name, rating, comment } (user_email optional)
export async function createReview(req, res) {
  try {
    const { product_name, rating, comment, user_email } = req.body || {};

    // Only require product name and comment; rating can default to 0/5
    if (!product_name || !comment) {
      return res.status(400).json({
        success: false,
        message: 'product_name and comment are required',
      });
    }

    const safeRating = typeof rating === 'number' && !Number.isNaN(rating) ? rating : 0;

    // Map to Supabase column names
    const newReview = {
      productname: product_name,
      rating: safeRating,
      comment,
      // Backend table requires username and useremail NOT NULL; use safe fallbacks
      username: user_email || 'Anonymous',
      useremail: user_email || 'anonymous@shreeraagaswaadghar.com',
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert([newReview])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase createReview error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to create review',
      });
    }

    const mapped = {
      id: data.id,
      product_name: data.productname,
      user_email: data.useremail,
      rating: data.rating,
      comment: data.comment,
      created_at: data.created_at,
    };

    return res.status(201).json({
      success: true,
      data: mapped,
    });
  } catch (err) {
    console.error('❌ createReview unexpected error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
}

// DELETE /api/reviews/:id
export async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Review id is required',
      });
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Supabase deleteReview error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete review',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (err) {
    console.error('❌ deleteReview unexpected error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
}
