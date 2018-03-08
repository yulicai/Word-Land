# Word-Land

### How can human language be shaped into a virtual sculpture, a word land, through the help of machine language.

Word Land is a project created by [Yuli Cai](https://www.caiyuli.com/), from her formal work [Word Land Route](https://github.com/yulicai/NOC_Intelligence-Learning/tree/master/word_land_route). This time the approach of the land takes place from 2 dimensions to 3 demensions. It takes a corpus of text, which are movies scripts in the following examples, process them through machine learning(word2vec), and visualize them as a 3D sculpture living in the screen using three.js. 

<br /> 

**Two parts are covered in this project.**
1. Natural Language Processing(word2vec), 
2. Visualization of the words (three.js) 

![Word Land, Visual](https://github.com/yulicai/Word-Land/raw/master/images/wordland2.gif)

***

Word Land created from the script of movie Captain America

![Word Land,Script from movie Captain America](https://github.com/yulicai/Word-Land/raw/master/images/wordland_gif.gif)

Word Land created from the script of movie The Post

![Word Land,Script from movie The Post](https://github.com/yulicai/Word-Land/raw/master/images/wordland_tp.gif)

Word Land created from the script of movie Iron Man

![Word Land,Script from movie Iron Man](https://github.com/yulicai/Word-Land/raw/master/images/wordland_im.gif)

**The following technical parts will be covered in a workshop.**
1. Basic text data process with python.
2. Intro to word2vec, work with word2vec with python library Gensim
3. t-SNE with python, work with hi-dimensional data.
4. Basic introduction to THREE.js, an 3D web visual JavaScript library.
5. From text to 3D visualization.


<br>

## Structure

1. **Basic Python**

2. **word2vec**
- 2.1 What is word2vec

- 2.2 Setups for word2vec



 3. **Three.js**

- 3.1 What is three.js

- 3.2 A basic basic example 

- 3.3 How to use Three.js to visualize our word2vec results

***

<br>

## 1. Basic Python 
Beautiful [intro to python documentation](https://github.com/antiboredom/detourning-the-web/blob/master/week_01/python_basics.md) by Sam Lavigne

- list()

	num = [0, 1, 2, 3, 4]

- Dictionary dict()
	
	d = {'cat': 'cute', 'dog': 'furry'}
	key, value pair

- Set()
	
	animals = {'cat', 'dog'}
	If an element is in the set, print(‘cat’ in animals) >> true


## 2. word2vec

### 2.1 What is word2vec

**CBOW and Skip Gram**

### 2.2 Setups for word2vec

- Using [Gensim a python library](https://radimrehurek.com/gensim/index.html), for semantics analysation on python to transform our text into word vectors.

- Using **t-SNE**("tee-s-nee") a popular method to do dimensionality reduction for high-dimensional data to reduce the dimensions of our word vectors into 2 or 3 dimensions for us to visualize it. In this case we are using [t-SNE from scikit-learn](http://scikit-learn.org/stable/modules/generated/sklearn.manifold.TSNE.html) to do the reduction



## 3. Three.js

### 3.1 What is three.js

### 3.2 A basic basic example 

### 3.3 How to use Three.js to visualize our word2vec json result







