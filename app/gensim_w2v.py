# coding: utf-8

# A script to do work2vec, taking the raw text data
# Using Gensim
# Yuli Cai
# 2018 March


import codecs
import sys
import re
# import multiprocessing
import json

import nltk
# uncomment the following line if this is the first time running this script
# nltk.download('punkt')
import gensim.models.word2vec as w2v
import numpy as np


source_text = u""
with codecs.open("../scripts/three_billboards_outside_ebbing_script.txt","r","utf-8") as raw:
    source_text += raw.read()

# using nltk(natural language toolkit)
tokenizer = nltk.data.load("tokenizers/punkt/english.pickle")
raw_sentences = tokenizer.tokenize(source_text)


# cleaning data
def sentence_to_wordlist(raw):
    # remove non letters and split into words
    # ^[a-zA-Z] means any a-z or A-Z at the start of a line
    #[^a-zA-Z] means any character that IS NOT a-z OR A-Z, it will be replaced by " " in this case
    # re: regular expression library
    make_sense = re.sub("[^a-zA-Z]"," ", raw)
    real_words = make_sense.lower().split()

    # remove common words and tokenize
    stoplist = set('m t an can be that was is it and the with for this of are th from at so to not'.split())

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
    workers= 4,
    size=80,
    min_count=3,
    window=10,
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


with open('../word_vector_data/three_billboards_outside_ebbing_gensim_result.json', 'w') as fp:
    json.dump(word_vectors, fp,sort_keys=True, indent=4)


# You can perform various NLP word tasks with the model. Some of them are already built-in:
# print (word_vectors)
# toprint =model.wv.similarity('bleak', 'spring')
# print (toprint)
