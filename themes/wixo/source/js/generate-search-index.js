hexo.extend.generator.register('search', function (locals) {
    const posts = locals.posts.sort('-date').filter(post => post.published);
    const searchData = posts.map(post => ({
        title: post.title,
        url: post.permalink,
        content: post.content.replace(/<[^>]+>/g, '').substring(0, 150) // Remove HTML tags and truncate content
    }));

    return {
        path: 'search.json',
        data: JSON.stringify(searchData)
    };
});
