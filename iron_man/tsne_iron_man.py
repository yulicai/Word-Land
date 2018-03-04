# found out that the following code does not work with python3
# but it works with python2
import json
import numpy as np
from sklearn.manifold import TSNE

raw_vectors =json.loads( open("captain_america_gensim_result.json").read())

vector_list = list()
word_list = list()
for value in raw_vectors.values():
    vector_list.append(value)
for key in raw_vectors.keys():
    word_list.append(key)

sizedown_vector = list()
# TSNE part
X = np.asarray(vector_list).astype('float64')
# convert it to a 3 dimensional vector space
tsne_model = TSNE(n_components=3, random_state=0)
np.set_printoptions(suppress=True)
sizedown_vector = tsne_model.fit_transform(X).tolist()

# create a result dictionary to hold the combination of word and its new vector
result_vectors = dict()
for i in range(len(word_list)):
    result_vectors[word_list[i]] = sizedown_vector[i]

with open('captain_america_3d_vector_result.json', 'w') as fp:
    json.dump(result_vectors, fp,sort_keys=True, indent=4)