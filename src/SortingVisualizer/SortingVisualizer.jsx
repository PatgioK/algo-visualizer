import React from 'react';
import './SortingVisualizer.css';
import { getMergeSortAnimations } from '../SortingAlgorithms/MergeSort';
import { getInsertionSortAnimations } from '../SortingAlgorithms/InsertionSort';
import { setTimeout } from 'timers';



// Original color of the array bars.
const PRIMARY_COLOR = 'aqua';

// Color we change to when we are comparing array bars.
const SECONDARY_COLOR = 'green';

// Speed of the animation in ms.
const ANIMATION_SPEED_MS = 200;

// Number of array bars.
const NUMBER_OF_BARS = 5;

export default class SortingVisualizer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            array: [],
        };
    }

    // React function runs first time component is rendered, client side only.
    componentDidMount() {
        this.resetArray();
    }

    resetArray() {
        const array = [];
        for (let i = 0; i < NUMBER_OF_BARS; i++) {
            array.push(randomIntfromInterval(10, 600));
        }
        this.setState({ array });
    }

    mergeSort() {
        const animations = getMergeSortAnimations(this.state.array);
        const arrayBars = document.getElementsByClassName('array-bar');

        for (let i = 0; i < animations.length; i++) {
            console.log(animations[i]);
            // Animations come in triplets. First two animations are what we are comparing
            // Third animation we overwrite the height
            const isColorChange = i % 3 !== 2;
            if (isColorChange) {
                const [barOneIdx, barTwoIdx] = animations[i];
                const barOneStyle = arrayBars[barOneIdx].style;
                const barTwoStyle = arrayBars[barTwoIdx].style;
                const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
                setTimeout(() => {
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;
                    // forloop happens instantly in javascript, so for each index i we want to multiply the delay by the index.
                }, i * ANIMATION_SPEED_MS);
            } else {
                setTimeout(() => {
                    const [barOneIdx, newHeight] = animations[i];
                    const barOneStyle = arrayBars[barOneIdx].style;

                    // Javascript bug, we want to get the value of the variable and then change to html + px;
                    // use extra functionality backtick and ${ } to embed variable into html;
                    barOneStyle.height = `${newHeight}px`;
                }, i * ANIMATION_SPEED_MS);
            }
        }
    }
    insertAndShift(arr, from, to) {
        let cutOut = arr.splice(from, 1); // cut the element at index 'from'
        arr.splice(to, 0, cutOut);            // insert it at index 'to'
    }
    insertionSort() {
        const animations = getInsertionSortAnimations(this.state.array);
        const arrayBars = document.getElementsByClassName('array-bar');

        let auxArray = this.state.array.slice();

        let barOneIdx;
        let barOneValue;

        let barTwoIdx;
        let barTwoValue;

        for(let i = 0; i < animations.length; i++) {
            let isFirstAnimation = i % 2 !== 1;
            if(isFirstAnimation) {
                const [barOneIdx, valueOne] = animations[i];
                setTimeout(() => {
                    arrayBars[barOneIdx].style.backgroundColor = SECONDARY_COLOR;
                }, i * ANIMATION_SPEED_MS);
            } else {
                const [barTwoIdx, valueTwo] = animations[i];
                this.insertAndShift(auxArray, barOneIdx, barTwoIdx);
                this.setState({array: auxArray});
                setTimeout(() => {
                    
                }, i * ANIMATION_SPEED_MS + ANIMATION_SPEED_MS);
            }
        }






        // for (let i = 0; i < animations.length; i++) {
        //     console.log(animations[i]);
        //     const [barOneIdx, value] = animations[i];
        //     const barOneStyle = arrayBars[barOneIdx].style;
        //     const firstPair = i % 2 !== 1;
        //     if (firstPair) {
        //         setTimeout(() => {
        //             barOneStyle.backgroundColor = SECONDARY_COLOR;
        //         }, i * ANIMATION_SPEED_MS);

        //         setTimeout(() => {
        //             barOneStyle.backgroundColor = PRIMARY_COLOR;
        //         }, i * ANIMATION_SPEED_MS + ANIMATION_SPEED_MS);
        //     } else {
        //         barOneStyle.height = `${value}px`;
        //     }
        // }
        //this.setState({array});
    }

    render() {
        const { array } = this.state;

        return (
            // Arrow function to use "this" context in the resetArray callback function: this.setState({array}).
            // React.Fragment allows us to return multiple elements under the same DOM.
            <React.Fragment>
                <div className='button-bar'>
                    <button onClick={() => this.resetArray()}>Generate Array</button>
                    <button onClick={() => this.insertionSort()}>Insertion Sort</button>
                    <button onClick={() => this.mergeSort()}>Merge Sort</button>
                    <button onClick={() => this.quickSort()}>Quick Sort</button>
                    <button onClick={() => this.heapSort()}>Heap Sort</button>
                    <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
                </div>
                <div className='array-container'>
                    {array.map((value, idx) => (
                        <div
                            className='array-bar'
                            key={idx}
                            // $ dollarsign makes a css variable???
                            style={{
                                backgroundColor: PRIMARY_COLOR,
                                height: `${value}px`,
                            }}
                        >
                        </div>
                    ))}
                </div>
            </React.Fragment>
        );
    }
}

// Generates random Integer in given interval.
// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntfromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}