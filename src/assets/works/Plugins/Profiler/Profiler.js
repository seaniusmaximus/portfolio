/* global $AD, document */

/* eslint-disable no-undefined */

export const EVENT_NAMES = {
  PROFILER_READY: 'profiler:ready',
  PROFILER_DESTROYED: 'profiler:destroyed',
  PROFILER_RESULTS_SHOW: 'profiler:results:show',
  PROFILER_OPTION_SELECTED: 'profiler:option:selected',
  PROFILER_RESULTS_CLICK: 'profiler:result:click',
  INTERACTION_SCROLL_FORWARD: 'interaction.scroll.forward',
  INTERACTION_SCROLL_BACKWARD: 'interaction.scroll.backward',
  INTERACTION_CLICK: 'interaction.click',
  OTHER_ENDSCREEN: 'other.endscreen',
};

function Profiler(config) {
  let conf = {
    container: undefined,
    multiSelect: false,
    shuffle: false,
    showNextButton: true,
    showPreviousButton: false,
    questions: undefined,
    results: undefined,
  };

  this.currentQuestionIndex = 0;
  this.eventListeners = []; // Track all event listeners for cleanup

  this.config = $AD.Utilities.deepMerge(conf, config);

  // Explicitly handle boolean values that might be false (in case deepMerge skips falsy values)
  if (config.multiSelect !== undefined) {
    this.config.multiSelect = config.multiSelect;
  }
  if (config.shuffle !== undefined) {
    this.config.shuffle = config.shuffle;
  }
  if (config.showNextButton !== undefined) {
    this.config.showNextButton = config.showNextButton;
  }
  if (config.showPreviousButton !== undefined) {
    this.config.showPreviousButton = config.showPreviousButton;
  }

  this.container = undefined;
}

Profiler.prototype = {
  // Helper to add event listener and track it for cleanup
  addTrackedEventListener: function (element, event, handler) {
    element.addEventListener(event, handler);
    this.eventListeners.push({ element, event, handler });
  },

  init: function () {
    this.container = this.config.container;
    // Reset result counts to ensure fresh start
    if (this.config.results) {
      this.config.results.forEach((result) => {
        result.count = 0;
      });
    }
    this.createQuiz();
  },

  handleSubmit: function (currentQuestion) {
    const selectedOptions = [];
    const inputs = currentQuestion.querySelectorAll('input:checked');

    inputs.forEach((input) => {
      const optionContainer = input.parentElement;
      const option = optionContainer.option;
      selectedOptions.push(option);

      option.weight.forEach((name) => {
        const resultItem = this.config.results.find(
          (result) => result.name === name
        );
        if (resultItem) {
          if (resultItem.count === undefined) {
            resultItem.count = 0;
          }
          resultItem.count += 1;
        }
      });
    });

    currentQuestion.style.display = 'none';
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.config.questions.length) {
      this.showNextQuestion();
    } else {
      this.showResults();
    }
  },

  handlePrevious: function (currentQuestion) {
    $AD.event(EVENT_NAMES.INTERACTION_SCROLL_BACKWARD);
    if (this.currentQuestionIndex > 0) {
      // Undo the weight counts from current question's selection before going back
      const inputs = currentQuestion.querySelectorAll('input:checked');
      inputs.forEach((input) => {
        const optionContainer = input.parentElement;
        const option = optionContainer.option;
        option.weight.forEach((name) => {
          const resultItem = this.config.results.find(
            (result) => result.name === name
          );
          if (resultItem && resultItem.count > 0) {
            resultItem.count -= 1;
          }
        });
      });

      currentQuestion.style.display = 'none';
      this.currentQuestionIndex--;
      this.showPreviousQuestion();
    }
  },

  showNextQuestion: function () {
    const quizContainer = this.container.querySelector('.quiz-container');
    const questionElements = quizContainer.querySelectorAll('.question');
    if (questionElements[this.currentQuestionIndex]) {
      questionElements[this.currentQuestionIndex].style.display = 'block';
    }
    $AD.event(EVENT_NAMES.INTERACTION_SCROLL_FORWARD);
  },

  showPreviousQuestion: function () {
    const quizContainer = this.container.querySelector('.quiz-container');
    const questionElements = quizContainer.querySelectorAll('.question');
    if (questionElements[this.currentQuestionIndex]) {
      const previousQuestion = questionElements[this.currentQuestionIndex];

      previousQuestion.style.display = 'block';
      this.updateSubmitButton(previousQuestion);
    }
  },

  handleResultsCtaClick: function (result) {
    $AD.event(EVENT_NAMES.PROFILER_RESULTS_CLICK, { meta: { result: result } });

    if (result.clickID) {
      if (result.url) {
        $AD.click(result.clickID, {
          overrides: {
            url: result.url,
          },
        });
      } else {
        $AD.click(result.clickID);
      }
    }
  },

  showResults: function () {
    const quizContainer = this.container.querySelector('.quiz-container');
    const quiz = quizContainer.querySelector('.quiz');
    quiz.innerHTML = '';

    // Find result with highest count
    let highestCount = 0;
    let topResult = this.config.results[0];

    this.config.results.forEach((result) => {
      if (result.count > highestCount) {
        highestCount = result.count;
        topResult = result;
      }
    });

    // Create results display
    const resultsDiv = document.createElement('div');
    resultsDiv.classList.add('results');

    const headline = document.createElement('h2');
    headline.textContent =
      topResult.headline || `Your Result: ${topResult.name}`;
    resultsDiv.appendChild(headline);

    if (topResult.image) {
      const image = document.createElement('img');
      image.src = topResult.image;
      image.alt = topResult.name;
      resultsDiv.appendChild(image);
    }

    if (topResult.text) {
      const text = document.createElement('p');
      text.textContent = topResult.text;
      resultsDiv.appendChild(text);
    }

    if (topResult.cta) {
      const ctaButton = document.createElement('button');
      ctaButton.classList.add('cta-button');
      ctaButton.textContent = topResult.cta;
      const ctaClickHandler = () => {
        this.handleResultsCtaClick(topResult);
      };
      this.addTrackedEventListener(ctaButton, 'click', ctaClickHandler);
      resultsDiv.appendChild(ctaButton);
    }

    quiz.appendChild(resultsDiv);

    $AD.event(EVENT_NAMES.OTHER_ENDSCREEN);
    $AD.event(EVENT_NAMES.PROFILER_RESULTS_SHOW, {
      meta: {
        result: topResult,
      },
    });
  },

  createOption: function (option, question, isMultiSelect, questionIndex) {
    const optionContainer = document.createElement('div');
    optionContainer.classList.add('option');
    optionContainer.option = option; // Store reference to option data

    const input = document.createElement('input');
    input.type = isMultiSelect ? 'checkbox' : 'radio';
    input.name = isMultiSelect ? '' : `question-${questionIndex}`;
    input.id = `option-${Math.random()}`;
    input.style.userSelect = 'none';
    input.style.pointerEvents = 'none';

    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = option.text;
    label.style.userSelect = 'none';
    label.style.pointerEvents = 'none'; // Prevent label from handling clicks

    optionContainer.appendChild(input);
    optionContainer.appendChild(label);

    // Handle click on the container itself (not on input/label)
    const containerClickHandler = (e) => {
      // Only handle clicks directly on the container, not bubbled from input/label
      if (e.target === optionContainer) {
        $AD.event(EVENT_NAMES.INTERACTION_CLICK);
        $AD.event(EVENT_NAMES.PROFILER_OPTION_SELECTED, {
          meta: {
            option: option.text,
          },
        });
        if (!isMultiSelect) {
          const allInputs = question.querySelectorAll('input[type="radio"]');
          allInputs.forEach((inp) => (inp.checked = false)); // eslint-disable-line
        }
        input.checked = !input.checked;
        this.updateSubmitButton(question);

        if (!isMultiSelect && !this.config.showNextButton && input.checked) {
          this.handleSubmit(question);
        }
      }
    };
    this.addTrackedEventListener(
      optionContainer,
      'click',
      containerClickHandler
    );

    // Handle change on the input (for clicks on input or label)
    const inputChangeHandler = () => {
      this.updateSubmitButton(question);

      if (!isMultiSelect && !this.config.showNextButton && input.checked) {
        this.handleSubmit(question);
      }
    };
    this.addTrackedEventListener(input, 'change', inputChangeHandler);

    return optionContainer;
  },

  updateSubmitButton: function (question) {
    const submitButton = question.querySelector('.submit-button');
    if (submitButton) {
      const checkedInputs = question.querySelectorAll('input:checked');
      submitButton.disabled = checkedInputs.length === 0;
    }
  },

  shuffleArray: function (array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  createQuestion: function (item, index) {
    const question = document.createElement('div');
    question.classList.add('question');
    question.style.display = index === 0 ? 'block' : 'none'; // Only show first question initially

    const questionText = document.createElement('h2');
    questionText.textContent = item.question;
    question.appendChild(questionText);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');
    question.appendChild(optionsContainer);

    // Shuffle options if shuffle is enabled
    const options = this.config.shuffle
      ? this.shuffleArray(item.options)
      : item.options;

    options.forEach((option) => {
      const optionButton = this.createOption(
        option,
        question,
        this.config.multiSelect,
        index
      );
      optionsContainer.appendChild(optionButton);
    });

    // Button container for navigation buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    question.appendChild(buttonContainer);

    // Previous button (only if showPreviousButton is true and not first question)
    if (this.config.showPreviousButton && index > 0) {
      const previousButton = document.createElement('button');
      previousButton.classList.add('previous-button');
      previousButton.textContent = 'Previous Question';
      const previousClickHandler = () => this.handlePrevious(question);
      this.addTrackedEventListener(
        previousButton,
        'click',
        previousClickHandler
      );
      buttonContainer.appendChild(previousButton);
    }

    // Next/Submit button (only if showNextButton is true or multiSelect is true)
    if (this.config.showNextButton || this.config.multiSelect) {
      const submitButton = document.createElement('button');
      submitButton.classList.add('submit-button');
      // Set button text based on whether this is the last question
      submitButton.textContent =
        index === this.config.questions.length - 1
          ? 'See Results'
          : 'Next Question';
      submitButton.disabled = true;
      const submitClickHandler = () => this.handleSubmit(question);
      this.addTrackedEventListener(submitButton, 'click', submitClickHandler);
      buttonContainer.appendChild(submitButton);
    }

    return question;
  },

  createQuiz: function () {
    const quizContainer = document.createElement('div');
    quizContainer.classList.add('quiz-container');
    this.container.appendChild(quizContainer);

    const quiz = document.createElement('div');
    quiz.classList.add('quiz');
    quizContainer.appendChild(quiz);

    // Shuffle questions if shuffle is enabled
    const questions = this.config.shuffle
      ? this.shuffleArray(this.config.questions)
      : this.config.questions;

    questions.forEach((item, index) => {
      const question = this.createQuestion(item, index);
      quiz.appendChild(question);
    });
  },

  ready: function () {
    $AD.event(EVENT_NAMES.PROFILER_READY);
  },

  destroy: function () {
    // Remove all tracked event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];

    // Clear the container
    if (this.container) {
      this.container.innerHTML = '';
    }
    // Reset current question index
    this.currentQuestionIndex = 0;
    // Reset result counts
    if (this.config.results) {
      this.config.results.forEach((result) => {
        result.count = 0;
      });
    }

    $AD.event(EVENT_NAMES.PROFILER_DESTROYED);
  },
};

export default Profiler;
