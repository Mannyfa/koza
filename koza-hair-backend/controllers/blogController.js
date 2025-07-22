// controllers/blogController.js

let placeholderPosts = [
    {
        id: 1,
        slug: 'top-5-hair-trends-this-season',
        title: 'Top 5 Hair Trends This Season in Lagos',
        summary: 'From sleek bone-straight to vibrant new colors, discover the must-have looks taking over the Lagos style scene.',
        imageUrl: 'https://images.unsplash.com/photo-1607346256330-16803a5a7f5a?q=80&w=2070&auto=format&fit=crop',
        author: 'Koza Hair Team',
        date: '2025-07-22',
        content: `
            <p>This season, the Lagos fashion and beauty scene is buzzing with excitement, and hair is at the forefront of every conversation. If you're looking to update your look, you've come to the right place. Here are the top 5 hair trends you absolutely need to try.</p>
            <h3 class="text-xl font-bold mt-4 mb-2">1. The Glass Hair (Bone Straight) Reign</h3>
            <p>Sleek, glossy, and impossibly straight hair continues its reign. The "glass hair" look, achieved with our premium bone-straight wigs, is a symbol of sophistication and class. It's a versatile look that works for both corporate settings and glamorous nights out.</p>
            <h3 class="text-xl font-bold mt-4 mb-2">2. Bold Colors are In</h3>
            <p>Don't be afraid to experiment! Burgundy, honey blonde, and even subtle hints of copper are making waves. A colored wig is the perfect way to try a new shade without committing to dye.</p>
        `
    },
    {
        id: 2,
        slug: 'how-to-style-your-wig-for-a-wedding',
        title: 'How to Style Your Wig for a Nigerian Wedding',
        summary: 'Aso-ebi ready! Learn how to perfectly style your wig to complement your outfit for that next big wedding event.',
        imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b1210a83a2a?q=80&w=2070&auto=format&fit=crop',
        author: 'Koza Hair Team',
        date: '2025-07-18',
        content: '<p>Getting your outfit ready for a wedding is only half the battle; your hair needs to be just as stunning! A well-styled wig is the perfect accessory. For a traditional look, a classic updo with a deep wave wig can be breathtaking. For a more modern take, consider long, flowing curls that cascade over your shoulders. Remember to secure your wig properly to dance the night away without any worries!</p>'
    }
];
let nextPostId = 3;

// Helper to create a URL-friendly slug
const createSlug = (title) => {
    return title.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');
};

// Get all blog posts (summary view)
exports.getAllPosts = (req, res) => {
    res.status(200).json({ status: 'success', data: { posts: placeholderPosts } });
};

// Get a single post by its slug (detailed view)
exports.getPostBySlug = (req, res) => {
    const post = placeholderPosts.find(p => p.slug === req.params.slug);
    if (!post) {
        return res.status(404).json({ status: 'fail', message: 'Post not found' });
    }
    res.status(200).json({ status: 'success', data: { post } });
};

// Create a new blog post
exports.createPost = (req, res) => {
    const { title, summary, content, imageUrl, author } = req.body;
    if (!title || !summary || !content) {
        return res.status(400).json({ message: 'Title, summary, and content are required.' });
    }
    const newPost = {
        id: nextPostId++,
        slug: createSlug(title),
        title,
        summary,
        content,
        imageUrl: imageUrl || 'https://placehold.co/800x600/cccccc/333333?text=Blog+Post',
        author: author || 'Koza Hair Team',
        date: new Date().toISOString()
    };
    placeholderPosts.unshift(newPost); // Add to the beginning of the array
    res.status(201).json({ status: 'success', data: { post: newPost } });
};

// Update a blog post
exports.updatePost = (req, res) => {
    const { id } = req.params;
    const { title, summary, content, imageUrl, author } = req.body;
    const postIndex = placeholderPosts.findIndex(p => p.id === parseInt(id));

    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const post = placeholderPosts[postIndex];
    post.title = title || post.title;
    post.summary = summary || post.summary;
    post.content = content || post.content;
    post.imageUrl = imageUrl || post.imageUrl;
    post.author = author || post.author;
    post.slug = createSlug(post.title); // Re-create slug in case title changed

    placeholderPosts[postIndex] = post;
    res.status(200).json({ status: 'success', data: { post } });
};

// Delete a blog post
exports.deletePost = (req, res) => {
    const { id } = req.params;
    const initialLength = placeholderPosts.length;
    placeholderPosts = placeholderPosts.filter(p => p.id !== parseInt(id));

    if (placeholderPosts.length === initialLength) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.status(204).send();
};
