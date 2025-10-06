 const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const movieContainer = document.getElementById('movieContainer');
    const noResults = document.getElementById('noResults');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.getElementById('closeModal');

    async function searchMovies() {
      const query = searchInput.value.trim();
      if (!query) {
        alert("Please Search a Movie");
        return;
      }

      noResults.textContent = 'Searching...';

      try {
        const res = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
        const data = await res.json();
        if (data.length === 0) {
          movieContainer.innerHTML = '';
          noResults.textContent = 'No results found.';
          return;
        }

        movieContainer.innerHTML = data.map(item => {
          const show = item.show;
          const image = show.image ? show.image.medium : 'https://via.placeholder.com/210x295?text=No+Image';
          return `
            <div class="movie-card">
              <img src="${image}" alt="${show.name}">
              <h3>${show.name}</h3>
              <button class="view-btn" onclick="viewDetails(${show.id})">View Details</button>
            </div>
          `;
        }).join('');

        noResults.textContent = '';
      } catch (error) {
        console.error(error);
        noResults.textContent = 'Error fetching data. Please try again later.';
      }
    }

    async function viewDetails(id) {
      try {
        const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
        const show = await res.json();

        const image = show.image ? show.image.original : 'https://via.placeholder.com/210x295?text=No+Image';
        const genres = show.genres && show.genres.length > 0 ? show.genres.join(', ') : 'N/A';
        const summary = show.summary ? show.summary : '<p>No description available.</p>';

        modalBody.innerHTML = `
          <img src="${image}" alt="${show.name}">
          <br>
          <h2><strong>Show Name:</strong> ${show.name}</h2>
          <br>
          <p><strong>Genre:</strong> ${genres}</p>
          <br>
          <div><strong>Summary:</strong>${summary}</div>
        `;

        modal.classList.add('active');
      } catch (error) {
        console.error(error);
      }
    }

    closeModal.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    searchBtn.addEventListener('click', searchMovies);
    searchInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') searchMovies();
    });
