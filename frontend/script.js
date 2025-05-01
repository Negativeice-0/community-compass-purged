document.addEventListener('DOMContentLoaded', () => {
    const neighborhoodSelect = document.getElementById('neighborhood');
    const newsContentDiv = document.getElementById('news-content');
    const eventsContentDiv = document.getElementById('events-content');
    const alertsContentDiv = document.getElementById('alerts-content');

    // Function to fetch and display data
    async function fetchData(contentType, container, neighborhood = '') {
        let url = `/community_compass/backend/api/get_${contentType}.php`;
        if (neighborhood) {
            url += `?neighborhood=${neighborhood}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                container.innerHTML = ''; // Clear previous content
                if (data.length > 0) {
                    data.forEach(item => {
                        const itemDiv = document.createElement('div');
                        itemDiv.classList.add('item');
                        let content = '';
                        if (contentType === 'news') {
                            content = `<h3> ${item.title}</h3><p>${item.summary}</p><p class="source">Source: ${item.source} ${item.location})</p>`;
                        } else if (contentType === 'events') {
                            content = `<h3>${item.title}</h3><p>${item.description}</p><p>Location: ${item.location}, Date: ${item.date}, Time: ${item.time}</p>`;
                        } else if (contentType === 'alerts') {
                            content = `<h3>Alert: ${item.message}</h3><p>Location: ${item.location}, Severity: ${item.severity}</p>`;
                        }
                        itemDiv.innerHTML = content;
                        container.appendChild(itemDiv);
                    });
                } else {
                    container.innerHTML = '<p>No items found.</p>';
                }
            } else {
                container.innerHTML = `<p>Error fetching ${contentType}: ${data.error || 'Something went wrong.'}</p>`;
            }
        } catch (error) {
            container.innerHTML = `<p>Error fetching ${contentType}: ${error.message}</p>`;
        }
    }

    // Function to populate the neighborhood dropdown
    async function populateNeighborhoods() {
        try {
            const response = await fetch('/community_compass/backend/api/get_neighborhoods.php');
            const neighborhoods = await response.json();

            if (response.ok) {
                neighborhoods.forEach(neighborhood => {
                    const option = document.createElement('option');
                    option.value = neighborhood;
                    option.textContent = neighborhood;
                    neighborhoodSelect.appendChild(option);
                });
            } else {
                console.error('Failed to fetch neighborhoods:', neighborhoods.error || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Error fetching neighborhoods:', error.message);
        }
    }

    // Initial data load (all neighborhoods)
    populateNeighborhoods();
    fetchData('news', newsContentDiv);
    fetchData('events', eventsContentDiv);
    fetchData('alerts', alertsContentDiv);

    // Event listener for neighborhood selection
    neighborhoodSelect.addEventListener('change', function() {
        const selectedNeighborhood = this.value;
        fetchData('news', newsContentDiv, selectedNeighborhood);
        fetchData('events', eventsContentDiv, selectedNeighborhood);
        fetchData('alerts', alertsContentDiv, selectedNeighborhood);
    });
});
