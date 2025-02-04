<script setup>
import { ref, onMounted } from 'vue';
import { Axios } from './services/Axios.js';

let photoData = ref([]);
let searchQuery = ref("");
let page = ref(1);
let selectedImage = ref(null); // New state for selected image
let isModalVisible = ref(false); // Modal visibility state

const fetchImageData = async () => {
  page.value = 1;
  try {
    const response = await Axios.get('/photos/random', { params: { count: 16 } });
    photoData.value = response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};

const fetchImageWithSearch = async () => {
  if (!searchQuery.value) return null;
  page.value = 1;
  try {
    const response = await Axios.get('/search/photos', {
      params: { query: searchQuery.value, page: page.value, count: 16 }
    });
    photoData.value = response.data.results || [];
  } catch (error) {
    console.error('Error fetching searched images:', error);
  }
};

const loadMoreImages = async () => {
  page.value++;
  try {
    let newData = [];

    if (!searchQuery.value) {
      const response = await Axios.get('/photos/random', { params: { count: 16 } });
      newData = response.data || [];
    } else {
      const response = await Axios.get('/search/photos', {
        params: { query: searchQuery.value, page: page.value, count: 16 }
      });
      newData = response.data.results || [];
    }

    photoData.value = [...photoData.value, ...newData];
  } catch (error) {
    console.error('Error loading more images:', error);
  }
};

const openPopup = (photo) => {
  selectedImage.value = photo;
  isModalVisible.value = true;
};

const closePopup = () => {
  isModalVisible.value = false;
  selectedImage.value = null;
};

onMounted(fetchImageData);
</script>

<template>
  <header>
    <h1>Unsplashy</h1>
  </header>

  <main>
    <div id="input-field">
      <input type="text" v-model="searchQuery" placeholder="Search for images..." />
      <button @click="fetchImageWithSearch">Search</button>
    </div>

    <div v-if="photoData.length" id="image-grid">
      <div v-for="photo in photoData" :key="photo.id" class="image-item" @click="openPopup(photo)">
        <img :src="photo.urls.small" :alt="photo.description || 'Image'" />
      </div>
    </div>

    <div v-if="photoData.length">
      <button @click="loadMoreImages">Load More</button>
    </div>
  </main>

  <div v-if="isModalVisible" class="pop-up" @click="closePopup">
    <div class="pop-up-content" @click.stop>
      <div class="pop-up-header">
      <button class="close-pop-up" @click="closePopup">X</button>
      </div>
      <img :src="selectedImage?.urls.full" :alt="selectedImage?.description || 'Full image'" />
    </div>
  </div>
</template>

<style scoped>
header {
  width: 100%;
  height: 10rem;
  padding: 70px 0;
}

header h1 {
  font-weight: bold;
  text-align: center;
  font-size: 4rem;
}

main {
  margin-bottom: 10rem;
}

#input-field {
  margin: 20px;
  display: flex;
  justify-content: center;
  background: white;
  width: 100%;
}

#input-field input {
  width: 30%;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

#input-field button {
  margin: 0;
  font-size: 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
}

#image-grid {
  width: 70%;
  padding: 16px;
  margin: auto;
  column-count: 4;
  column-gap: 10px;
}

.image-item {
  break-inside: avoid;
  margin-bottom: 10px;
}

.image-item img {
  width: 100%;
  display: block;
  border-radius: 8px;
  cursor: pointer;
}

button {
  display: block;
  margin: 20px auto;
  padding: 12px 24px;
  font-size: 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.pop-up {
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.pop-up-content img {
  background: white;
  padding: 0px 20px 20px 20px;
  width: 100%;
  max-width: 800px;
  max-height: 800px;
  border-radius: 0px 0px 5px 5px;
  text-align: center;
}

.pop-up-header{
  width: 100%;
  background: white;
  border-radius: 5px 5px 0px 0px;
  justify-items: end;
}

.close-pop-up {
  text-align:end;
  right: 0;
  margin: 0;
  padding: 10px;
  background: transparent;
  color: black;
  border: none;
  cursor: pointer;
}

</style>
