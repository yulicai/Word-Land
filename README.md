# Word-Land

### How can human language be shaped into a virtual sculpture, a word land, through the help of machine language.

Word Land is a project created by [Yuli Cai](https://www.caiyuli.com/), from her formal work [Word Land Route](https://github.com/yulicai/NOC_Intelligence-Learning/tree/master/word_land_route). This time the approach of the land takes place from 2 dimensions to 3 demensions. It takes a corpus of text, which are movies scripts in the following examples, process them through machine learning(word2vec), and visualize them as a 3D sculpture living in the screen using three.js.  
Play some live examples from movies of Oscar 2018 [here](http://www.caiyuli.com/work/word-land/)  

#### Resources

I've gained lots of help from [Dan Shiffman](http://shiffman.net/a2z/) and [Allison Parrish](https://www.decontextualize.com/) and also the greate internet. Putting up this [resources page](https://github.com/yulicai/Word-Land/blob/master/RESOURCES.md) to collect all of the related documents. From the original paper, to text data, to visualization tool for t-sne etc.  

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

#### Here is an illustration of the workflow.

![workflow](https://github.com/yulicai/Word-Land/raw/master/images/workflow.png)


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
	Key, value pair

- Set()
	
	animals = {'cat', 'dog'}  
	If an element is in the set, print(‘cat’ in animals) >> true

<br />

## 2. word2vec

### 2.1 What is word2vec

"You shall know a word by the company it keeps."  --J.R.Firth 1957  

[word2vec example on ML5](https://ml5js.github.io/docs/word2vec-example.html)

“Some of the most interesting data doesn’t have a clear numeric representation” --Kyle McDonald

The idea of word2vec is to *predict between every word and its context words*. Some other similar concept terms for it are *Distributional semantics* and *Word Embeddings*.  

There are 2 main learning algorithms in word2vec.  

<br />

**CBOW(Continuous bag of words) and Skip Gram**

![2algorithms](https://github.com/yulicai/Word-Land/raw/master/images/2algorithms.png)

| Skip-Gram        | CBOW           
| ------------- |:-------------:| 
| Predicting the context given the word     | Predict the word given its context | 
| Works well with small amount of traing data     | Several time faster than skip gram      |   
| Represents well even for rare words or phrases | Slightly better accuracy for frequent word    | 
| The skip-gram architecture weighs nearby context words more heavily than more distant context words. More distant words are given less weight by randomly sampling them | The order of context words does not influence prediction|
| Recommanded window size: 10 | Recommanded window size: 5| 

<br />

***

### 2.2 Setups for word2vec

- Using [Gensim a python library](https://radimrehurek.com/gensim/index.html), for semantics analysation on python to transform our text into word vectors.

- Using **t-SNE**("tee-s-nee") a popular method to do dimensionality reduction for high-dimensional data to reduce the dimensions of our word vectors into 2 or 3 dimensions for us to visualize it. In this case we are using [t-SNE from scikit-learn](http://scikit-learn.org/stable/modules/generated/sklearn.manifold.TSNE.html) to do this reduction



### 2.2.1 Python environment setup
We are using python2 in this case  

#### a. Check your python version
Open terminal on MacOS, and type in the following and hit enter
```
python -V
```

#### b. Install pip
pip is a tool to install python library. You can either follow the [install guide here](https://pip.pypa.io/en/stable/installing/)  
Or if you are on MacOS, open terminal, using commend line  
```
sudo easy_install pip
```
You will be asked for your mac password, type it and hit enter.

#### c. Install virtualenv
virtualenv creates isolated python environments tied to specific projects.
```
sudo pip install virtualenv
```


### 2.2.2 Setup our word2vec project!

#### a. Setup directory(folder) and virtual environment 

Create a new project folder "your_project_name", and [cd(change directory)](https://askubuntu.com/questions/520778/how-can-i-change-directories-in-the-terminal) to this folder on terminal.  
In terminal, type in the following to create a virtual environment for this project and activate it
```
virtualenv env
source env/bin/activate
```
You should see (env) at the front of the current line in terminal.


#### b. Install dependencies

- gensim, nltk, scikit-learn
```
pip install nltk && pip freeze >requirements.txt
pip install gensim && pip freeze >requirements.txt
pip install -U scikit-learn
```

<br />

***

### 2.3 Start with Gensim!

The essentials

```python
from gensim.models import Word2Vec
model= Word2Vec()
```

In our code (app/gensim_w2v.py), there are more optinal parameters to control
```python
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
```

#### Some notes from the papers and tutorials online for the above parameters.
- Dimensions(size), default value is 100  
Bigger size values require more training data, but can lead to better (more accurate) models. Reasonable values are in the tens to hundreds.   

- Context window (window)   
The recommended context window size is 10 for skip-gram and 5 for CBOW  

- min_count, default value is 5  
Words that appear only once or twice in a billion-word corpus are probably uninteresting typos and garbage. In addition, there’s not enough data to make any meaningful training on those words, so it’s best to ignore them. A reasonable value for min_count is between 0-100, depending on the size of your dataset.  

#### You can also store and load models in gensim
```python
model.save('/tmp/mymodel')
new_model = gensim.models.Word2Vec.load('/tmp/mymodel')
```

<br />

***

### 2.4 Dimensionality Reduction with t-SNE

[A great site showing how t-SNE work visually](http://scienceai.github.io/tsne-js/)

A popular method for exploring high-dimensional data is something called t-SNE, introduced by van der Maaten and Hinton in 2008. It has an almost magical ability to create compelling two-dimensonal “maps” from data with hundreds or even thousands of dimensions. 

**Start a new file called tsne_reduction.py**
```python
import numpy as np
from sklearn.manifold import TSNE

```

Essential part
```python
sizedown_vector = list()
# TSNE part
# Create a numpy array from vector list()
X = np.asarray(vector_list).astype('float64')
# Convert it to a 3 dimensional vector space
# Parameters matters
tsne_model = TSNE(n_components=3, early_exaggeration=14.0, learning_rate=300.0, random_state=0)
np.set_printoptions(suppress=True)
#.fit_transform: fit X into an embeded space and return that transformed output
#.tolist(): use tolist() to convert numpy array into python list data structure 
sizedown_vector = tsne_model.fit_transform(X).tolist()
```

#### Some notes from the papers and tutorials online for the above parameters.
- p_components - default: 2  
Dimension of the embedded space

- perplexity - default: 30  
 Larger datasets usually require a larger perlexity. Resonable value: 5-50, but t-sne is **insensitive** to this parameter  

- early_exaggeration - default: 12.0
 Controls how tight natural clusters in the original space are in the embedded space and how much space will be between them. For larger values, the space between natural clusters will be larger in the embedded space.  

- learning_rate - default:200.0  
The learning rate for t-SNE is usually in the range [10.0, 1000.0]. If the learning rate is too high, the data may look like a ‘ball’ with any point approximately equidistant from its nearest neighbours. If the learning rate is too low, most points may look compressed in a dense cloud with few outliers.  


<br />

***





## 3. Three.js

### 3.1 What is three.js

[How 3d works](http://content.mindofmatthew.com/how_3d_works/) A great explaination by Matthew Kaney.

### 3.2 A basic basic example 

![basic3js](https://github.com/yulicai/Word-Land/raw/master/images/basic3js.png)

### 3.3 How to use Three.js to visualize our word2vec json result

[TypeFace.js converter](https://gero3.github.io/facetype.js/). You need to convert a normal font file into JSON file before loading it into THREE.js  








