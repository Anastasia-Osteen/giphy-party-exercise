$(document).ready(function() {
    const $gifArea = $("#gif-area");
    const $searchForm = $("#searchform");
    const $removeButton = $("#removeButton");
    const $searchButton = $("#searchButton");
    const $searchInput = $("#search");
    const $suggestionsContainer = $("<div>", { id: "suggestions-container" });

    $searchButton.on("click", function(event) {
        event.preventDefault();
        const searchTerm = $searchInput.val();
        searchGiphy(searchTerm);
        $searchInput.val("");
    });

    $searchInput.on("input", function() {
        const searchTerm = $searchInput.val();
        fetchApiData(searchTerm, function(apiData) {
            showSuggestions(apiData);
        });
    });

    $searchForm.append($suggestionsContainer);

    $removeButton.on("click", function() {
        $gifArea.empty();
    });

    function fetchApiData(searchTerm) {
        const apiKey = "GLT3gcqeUC5Z5mDmTGAJmXMRSpTIq1wE";
        const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTerm}`;

        axios
            .get(apiUrl)
            .catch(function(error) {
                console.log("An error has been encountered while fetching data from Giphy!", error);
            });
    }

    function searchGiphy(searchTerm) {
        const apiKey = "GLT3gcqeUC5Z5mDmTGAJmXMRSpTIq1wE";
        let apiUrl;

        if (searchTerm) {
            apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTerm}`;
        } else {
            apiUrl = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}`;
        }

        axios
            .get(apiUrl)
            .then(function(response) {
                const data = response.data;
                const gifs = searchTerm ? data.data : [data.data];
                if (gifs.length > 0) {
                    $gifArea.empty();
                    gifs.forEach(function(gif) {
                        const gifUrl = gif.images.original.url;
                        appendGif(gifUrl);
                    });
                }
            })
            .catch(function(error) {
                console.log("An error has been encountered while searching Giphy!", error);
            });
    }

    function appendGif(url) {
        const $col = $("<div>", { class: "col" });
        const $gifContainer = $("<div>", { class: "gif-container" });
        const $gif = $("<img>", { src: url });

        $gifContainer.append($gif);
        $col.append($gifContainer);
        $gifArea.append($col);
    }

    function showSuggestions(apiData) {
        $suggestionsContainer.empty();

        const suggestions = apiData.map(gif => gif.title);
        suggestions.forEach(function(suggestion) {
            const $suggestion = $("<div>", { class: "suggestion" });
            $suggestion.text(suggestion);
            $suggestion.on("click", function() {
                $searchInput.val(suggestion);
                searchGiphy(suggestion);
                $suggestionsContainer.empty(); 
            });
            $suggestionsContainer.append($suggestion);
        });

        if (suggestions.length === 0) {
            $suggestionsContainer.hide(); 
        } else {
            $suggestionsContainer.show(); 
        }
    }

    $(document).on("click", function(event) {
        if (!$(event.target).closest($searchInput).length) {
            $suggestionsContainer.empty();
        }
    });
});