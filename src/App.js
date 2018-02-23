import React, { Component } from 'react';
import './App.css';
import { poemsDb }from './db/store';
import { Button, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle } from 'reactstrap';


class App extends Component {

    constructor(){
        super();
        this.state = {
            corpus: '',
            line: [],
            dropdownOpen: false,
            wordCount: 0,
            verseCount: 1,
            gotPoems: []
        }

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.parseText = this.parseText.bind(this);
        this.generateWordPairs = this.generateWordPairs.bind(this);
        this.writeline = this.writeline.bind(this);
        this.toggle = this.toggle.bind(this);
        this.verseCounter = this.verseCounter.bind(this);
        this.pushToDb = this.pushToDb.bind(this);
        this.getPoems = this.getPoems.bind(this);
        this.handleSubmitPub = this.handleSubmitPub.bind(this);
    }

    componentWillMount(){
        this.getPoems()
    }

    pushToDb(poem){
        poemsDb.add({
            poem
        }).then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    getPoems(){
        let that = this;
        poemsDb.get().then(function(querySnapshot){
            let gotPoems = [];
            querySnapshot.forEach(function(data){
                gotPoems.push(data.data().poem);
            })
            that.setState({
                gotPoems
            })
            console.log(gotPoems);
        })
    }

    handleOnChange(ev){
          ev.preventDefault();
          const target = ev.target;
          const value = target.value;
          const name = target.name;

          this.setState({
              [name]: value
          })
    }

    parseText(corpus){
        console.log(typeof corpus);
        let wordCut = corpus.toLowerCase().split(/\s"?|\.?\s|,?\s|"?\s/);
        return wordCut;
    }

    handleSubmit(){
        if(this.state.corpus.length < 30){
            alert('Enter a larger corpus');
        }else{
            let poem = [];
            let pairs = this.generateWordPairs(this.state.corpus);
            console.log(pairs);

            for(let i = 0; i < this.state.verseCount; i++){
                let lines = this.writeline(pairs, this.state.wordCount)
                if(i === 0){
                    let toUp = lines[0].toUpperCase() + lines.slice(1);
                    poem.push(toUp);
                    continue;
                }else
                poem.push(lines);
            }

            this.setState({
                line: poem
            })


        }
        this.getPoems();
    }

    handleSubmitPub(){
        this.pushToDb(this.state.line);
    }

    generateWordPairs(corpus){
      let markovWords = {};
      let words = this.parseText(this.state.corpus);

      for(let i = 0; i < words.length; i++){
        let currentWord = words[i];
        let nextWord = words[i + 1];

        if(markovWords[currentWord]){
            if(nextWord !== undefined){
                markovWords[currentWord].push(nextWord);
            }
        }else{
          markovWords[currentWord] = [nextWord];
        }
      }
      return markovWords;
    }

    writeline(pairs, n){
      let wordsList = Object.keys(pairs);
      let line = '';
      let currentWord = '';
      let wordToAdd = '';

      function randomRange(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

      function wordInRange(currentWord){
            if(currentWord === wordsList[wordsList.length - 1]){
              currentWord = wordsList[randomRange(0, wordsList.length - 1)];
            }
            let following = pairs[currentWord];
            console.log(currentWord);
            let randomWord = randomRange(0, following.length - 1);
            return following[randomWord];
          }

          for(let i = 0; i < n; i++){
            if(!currentWord){
              currentWord = wordsList[randomRange(0, wordsList.length - 1)];
            }else{
              currentWord = wordToAdd;
            }

            wordToAdd = wordInRange(currentWord);
            line += (wordToAdd + ' ');
          }
          console.log(line);
      return line;
    }

    toggle() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
    }

    verseCounter(ev){
        ev.preventDefault();
        const name = ev.target.name;

        this.setState({
            verseCount: parseInt([name])
        })
    }


  render() {
      let poem = this.state.line.map((lines, index) => {
          return <li key={index}>{lines}</li>
      })

      let getPoem = this.state.gotPoems.map((poe, index) => {
          return <Card key={index} className="Card">
                    <CardBody>
                      <CardText><ul>{poe.map((line, indexes) => <li key={indexes}>{line}</li>)}</ul></CardText>
                    </CardBody>
                  </Card>
      })
    console.log(this.state.verseCount);
    return (
      <div className="App" >
          <h1>Romance.js</h1>
        <InputGroup className="Inputs">
            <Input placeholder="corpus" name="corpus" onChange={ this.handleOnChange }></Input>
            <Input placeholder="word count" name="wordCount" onChange={ this.handleOnChange }></Input>
            <Button onClick={ this.handleSubmit }>Submit</Button>
            <Button onClick={ this.handleSubmitPub }>Publish</Button>
        </InputGroup>
            <div>
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                  Verses count
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Verses count</DropdownItem>
                  <DropdownItem onClick={ this.verseCounter } name='1'>1 line</DropdownItem>
                  <DropdownItem onClick={ this.verseCounter } name='4'>4 lines</DropdownItem>
                  <DropdownItem onClick={ this.verseCounter } name='8'>8 lines</DropdownItem>
                  <DropdownItem onClick={ this.verseCounter } name='12'>12 lines</DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
            <ul>{poem}</ul>
            <div>
                <ul>{getPoem}</ul>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
