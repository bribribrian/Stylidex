import axios from 'axios';

export const fetchCollections = (userId) => {
    return axios.get(`/api/collections?user_id=${userId}`);
};

export const fetchCollectionsWithFilters = (userId, bodyFilters) => {
    return axios.get(`/api/collections?user_id=${userId}`, bodyFilters);
};

export const fetchCollection = (collectionId) => {
    return axios.get(`/api/collections/${collectionId}`);
};

export const createCollection = (collection) => {
    return axios.post('/api/collections', collection);
};

export const updateCollection = (collection) => {
    return axios.patch(`/api/collections/${collection.id}`, collection);
};

export const deleteCollection = (collectionId) => {
    return axios.patch(`/api/collections/${collectionId}`);
};
