import api from './api';

export const resultsService = {
async getResults() {
const response = await api.get('/results');
return response.data;
},

async checkCoordinates(coordinates) {
const response = await api.post('/results', { ...coordinates });
return response.data;
},

async clearResults() {
const response = await api.delete('/results');
return response.data;
}
};