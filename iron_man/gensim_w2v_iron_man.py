# using python3
# source activate iron_man
import codecs
import sys
import re
import multiprocessing
import json

import nltk
import gensim.models.word2vec as w2v
import numpy as np


source_text = u""
with codecs.open("captain_america_script.txt","r","utf-8") as raw:
    source_text += raw.read()

# using nltk(natural language toolkit)
tokenizer = nltk.data.load("tokenizers/punkt/english.pickle")
raw_sentences = tokenizer.tokenize(source_text)


# cleaning data
def sentence_to_wordlist(raw):
    # remove non letters and split into words
    # ^[a-zA-Z] means any a-z or A-Z at the start of a line
    #[^a-zA-Z] means any character that IS NOT a-z OR A-Z
    make_sense = re.sub("[^a-zA-Z]"," ", raw)
    real_words = make_sense.lower().split()

    # remove common words and tokenize
    stoplist = set('m t'.split())

    # Create a list of words
    texts = [word for word in real_words if word not in stoplist]
    return texts


sentences = []
for raw in raw_sentences:
    if(len(raw)>0):
        # A list within list
        sentences.append(sentence_to_wordlist(raw))

# initialize model with gensim object
# https://codesachin.wordpress.com/2015/10/09/generating-a-word2vec-model-from-a-block-of-text-using-gensim-python/
# size - number of dimensions
# sg – This defines the algorithm. If equal to 1, the skip-gram technique is used. Else, the CBoW method is employed
# min_count – Terms that occur less than min_count number of times are ignored in the calculations. This reduces noise in the semantic space
# window - how far away can a assiociated word be at
model = w2v.Word2Vec(
    sg=1,
    seed=1,
    workers= multiprocessing.cpu_count(),
    size=200,
    min_count=1,
    window=7,
    sample=1e-3
)
model.build_vocab(sentences)
model.train(sentences, total_examples=model.corpus_count,epochs=model.iter)


word_vectors = dict()
for sentence in sentences:
    for word in sentence:
        try:
            # The word vectors are stored in a KeyedVectors instance in model.wv.
            # .tolist() -- Converting NumPy array into Python List structure
            word_vectors[word]=list(model.wv[word].tolist())
        except KeyError:
            break


with open('captain_america_gensim_result.json', 'w') as fp:
    json.dump(word_vectors, fp,sort_keys=True, indent=4)


# You can perform various NLP word tasks with the model. Some of them are already built-in:
# print (word_vectors)
# toprint =model.wv.similarity('bleak', 'spring')
# print (toprint)
