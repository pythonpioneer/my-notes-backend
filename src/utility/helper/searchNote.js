/**
 * to search notes based on search text and match the search text with any fields such as some words matches other fields and some matches other.
 * @param {Array} notes - An array of objects, { "title": "newers", "desc": "newss", "category": "todo"};
 * @param {String} searchText - The searchable string to search the notes
 * @returns {Array} - Returns array as per search text, some word matches title or some matches desc or some matches category.
 */
exports.searchNote = (notes, searchText) => {

    // if there is noting to search
    if (!searchText) return notes;

    // first check that the searchText contain multiple words or single words
    const searchWords = searchText.split(' ');

    // if searchText contain only single word then filter the array on the basis of the searchText
    if (searchWords.length <= 1) return notes.filter(note => note.title.toLowerCase().includes(searchText) || note.category.toLowerCase().includes(searchText) || note.desc.toLowerCase().includes(searchText));

    // if searchText contain more than one word "long news"
    const res = notes.filter(note =>
        searchWords.some(word =>
            note.title.toLowerCase().includes(word) ||
            note.desc.toLowerCase().includes(word) ||
            note.category.toLowerCase().includes(word)
        )
    );
    
    return res;
};

