# A script to do t-sne with word vector data 
# Using sklearn t-sne
# Yuli Cai
# 2018 March


# python 2
import json
import numpy as np
from sklearn.manifold import TSNE

movie = "moonlight"

source_path = '../word_vector_pretrained_data/' + movie+"/" +movie+"_gensim_result.json"
output_path = '../word_vector_pretrained_data/' + movie+"/" + movie+ "_3d_vector_result.json"

# Load raw json data
raw_vectors =json.loads( open(source_path).read())

# Create two list to store words and their vectors separately
vector_list = list()
word_list = list()
for value in raw_vectors.values():
    vector_list.append(value)
for key in raw_vectors.keys():
    word_list.append(key)


sizedown_vector = list()
# TSNE part
# Create a numpy array from vector list()
X = np.asarray(vector_list).astype('float64')
# Convert it to a 3 dimensional vector space
# Parameters matters
tsne_model = TSNE(n_components=3, early_exaggeration=8.0, learning_rate=300.0, random_state=0)
np.set_printoptions(suppress=True)
#.fit_transform: fit X into an embeded space and return that transformed output
#.tolist(): use tolist() to convert numpy array into python list data structure 
sizedown_vector = tsne_model.fit_transform(X).tolist()

# create a result dictionary to hold the combination of word and its new vector
result_vectors = dict()
for i in range(len(word_list)):
    result_vectors[word_list[i]] = sizedown_vector[i]

with open(output_path, 'w') as fp:
    json.dump(result_vectors, fp,sort_keys=True, indent=4)