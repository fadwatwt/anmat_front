const convertToSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export {convertToSlug}