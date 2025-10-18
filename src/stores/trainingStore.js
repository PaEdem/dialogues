// src/stores/trainingStore.js
import { defineStore } from 'pinia';
import i18n from '../i18n';
import { marked } from 'marked';
import { useDialogStore } from './dialogStore';
import { useUiStore } from './uiStore';
import { compareAndFormatTexts } from '../utils/compareTexts';
import { fetchGeminiResponse } from '../services/geminiService';

export const useTrainingStore = defineStore('training', {
  state: () => ({
    currentTrainingType: '',
    currentLineIndex: 0,
    recognition: null,
    isVoiceOver: false,
    isMicActive: false,
    recognitionText: '',
    formattedRecognitionText: '',
    geminiResult: '',
    isLoading: false,
  }),
  getters: {
    currentQuizOptions(state) {
      const dialogStore = useDialogStore();
      const dialog = dialogStore.currentDialog;
      if (!dialog || !dialog.options || !dialog.options[state.currentLineIndex]) {
        return [];
      }
      const correctAnswer = { text: dialog.rus[state.currentLineIndex], correct: true };
      const incorrectOptions = dialog.options[state.currentLineIndex].map((o) => ({ text: o, correct: false }));
      const allOptions = [correctAnswer, ...incorrectOptions];

      return allOptions.sort(() => Math.random() - 0.5);
    },
  },
  actions: {
    setCurrentTrainingType(type) {
      this.currentTrainingType = type;
    },
    startLevel() {
      this.stopSpeech();
      this.currentLineIndex = 0;
      this.resetLineState();
      if (this.currentTrainingType !== 'level-3') {
        setTimeout(() => this.playCurrentLineAudio(), 500);
      }
    },
    nextLine() {
      this.stopSpeech();
      const dialogStore = useDialogStore();
      if (this.currentLineIndex < dialogStore.currentDialog.fin.length - 1) {
        this.currentLineIndex++;
        this.resetLineState();
        if (this.currentTrainingType !== 'level-3') {
          this.playCurrentLineAudio();
        }
      } else {
        const uiStore = useUiStore();
        uiStore.showModal();
      }
    },
    repeatLevel() {
      this.stopSpeech();
      this.startLevel();
    },
    resetLineState() {
      this.recognitionText = '';
      this.formattedRecognitionText = '';
      this.geminiResult = '';
    },
    playCurrentLineAudio() {
      const dialogStore = useDialogStore();
      const text = dialogStore.currentDialog?.fin[this.currentLineIndex];
      if (text) {
        this.playText(text);
      }
    },
    playProDemoVoice() {
      // В будущем здесь будет вызов Google Cloud TTS API
      const proVoiceUtterance = new SpeechSynthesisUtterance(
        'Näin ääni kuulostaa PRO-versiossa. Paljon parempi, eikö niin?'
      );
      proVoiceUtterance.lang = 'fi-FI';

      const voices = speechSynthesis.getVoices();
      const proVoice = voices.find((voice) => voice.lang === 'fi-FI' && voice.name.includes('Google'));
      if (proVoice) {
        proVoiceUtterance.voice = proVoice;
      }

      this.stopSpeech();
      speechSynthesis.speak(proVoiceUtterance);
    },
    playText(text) {
      if (!text) return;
      this.stopSpeech();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fi-FI';
      speechSynthesis.speak(utterance);

      utterance.onstart = () => {
        this.isVoiceOver = true;
      };
      utterance.onend = () => {
        this.isVoiceOver = false;
      };
    },
    stopSpeech() {
      speechSynthesis.cancel();
      this.isVoiceOver = false;
    },
    togglePlayStop(text) {
      !this.isVoiceOver ? this.playText(text) : this.stopSpeech();
    },
    toggleSpeechRecognition() {
      if (this.recognition) {
        this.recognition.stop();
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Speech recognition is not supported in this browser.');
        return;
      }

      const dialogStore = useDialogStore();
      const currentDialog = dialogStore.currentDialog;
      if (!currentDialog) return;

      const finText = currentDialog.fin[this.currentLineIndex];
      const rusText = currentDialog.rus[this.currentLineIndex];
      const level = currentDialog.level;

      this.recognitionText = '';
      this.formattedRecognitionText = '';
      this.geminiResult = '';

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'fi-FI';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.isMicActive = true;
        this.recognitionText = i18n.global.t('store.listening');
      };

      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          finalTranscript += event.results[i][0].transcript;
        }
        this.recognitionText = finalTranscript;
      };

      this.recognition.onerror = (event) => {
        console.error('Ошибка распознавания речи:', event.error);
        this.recognitionText = i18n.global.t('store.error');
        this.isMicActive = false;
        this.recognition = null;
      };

      this.recognition.onend = () => {
        this.isMicActive = false;
        this.recognition = null;

        const finalTranscript = this.recognitionText.trim();

        if (finalTranscript && finalTranscript !== i18n.global.t('store.listening')) {
          if (this.currentTrainingType === 'level-2') {
            const { formattedText } = compareAndFormatTexts(finText, finalTranscript);
            this.formattedRecognitionText = formattedText;
          } else if (this.currentTrainingType === 'level-3') {
            this.checkUserTranslation(rusText, finText, level);
          }
        } else {
          this.recognitionText = '';
        }
      };
      this.recognition.start();
    },
    async generateAndCreateDialog(creationParams) {
      this.isLoading = true;
      try {
        const prompt = this.getPromptForNewDialog(creationParams);
        const responseText = await fetchGeminiResponse(prompt);

        const cleanJsonString = responseText.trim().replace(/```json|```/g, '');
        const dialogData = JSON.parse(cleanJsonString);

        const dialogStore = useDialogStore();
        const newDialogId = await dialogStore.createDialog(dialogData, creationParams);

        return newDialogId;
      } catch (error) {
        console.error('Full cycle of dialogue generation and creation failed:', error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchDialogAnalysis() {
      const dialogStore = useDialogStore();
      const dialog = dialogStore.currentDialog;
      if (!dialog) return;

      this.isLoading = true;
      this.geminiResult = '';
      try {
        const fullDialogText = dialog.fin.join('\n');
        const prompt = this.getPromptInfo(fullDialogText, dialog.level);
        const rawResult = await fetchGeminiResponse(prompt);

        this.geminiResult = marked.parse(rawResult);
      } catch (error) {
        console.error('Error getting dialogue analysis:', error);
        const errorMessage = i18n.global.t('store.resultError');
        this.geminiResult = `<p>${errorMessage}</p>`;
      } finally {
        this.isLoading = false;
      }
    },
    getPromptForNewDialog(params) {
      const { topic, level, replicas, words } = params;
      return `Create a coherent short dialogue in Finnish on the topic of "${topic}", with a parallel Russian translation for each line. The Finnish dialogue should be at the language proficiency level ${level}, using simple structures and vocabulary appropriate for that level. The entire dialogue must consist of exactly ${replicas} replicas (lines spoken by alternating speakers, like Person A and Person B). Incorporate all the following Finnish words naturally into the dialogue: ${words}.
      
      For each Finnish replica, you must also generate three incorrect but plausible Russian translations. These incorrect options should be plausible distractors for a language learner, for example by using words that sound similar but have different meanings, incorrect grammar, or a contextually wrong translation.

      Output the response strictly in JSON format with three keys: "fin", "rus", and "options". Do not include any additional text, explanations, or keys in the JSON.
      
      Example output format:
      {
        "fin": ["Moi.", "Mitä kuuluu?"],
        "rus": ["Привет.", "Как дела?"],
        "options": [
          ["Мой.", "Пока.", "Доброе утро."],
          ["Что включено?", "Как твое имя?", "Куда ты идешь?"]
        ]
      }`;
    },
    getPromptForTranslation(rusText, finText, level) {
      return `
        You are an expert Finnish language tutor specializing in dialogue translations. Your task is to evaluate a user's spoken Finnish translation of a Russian dialogue line by comparing it to the provided correct Finnish version taking into account the language level of the user of the corresponding ${level}. You will receive three inputs:

        Original Russian: ${rusText}.
        Correct Finnish: ${finText}.
        User's Spoken Finnish (transcription): ${this.recognitionText}.
        
        Analyze the user's transcription for semantic accuracy, naturalness, and key errors in meaning or phrasing. Ignore the presence or absence of punctuation marks, capital letters, and pauses.

        If the meaning is accurately conveyed (minor pronunciation/word choice issues are okay if intent is clear): Say something like "Отлично, смысл понятен!"
        
        If there are small errors (e.g., wrong word but overall meaning intact): Point out 1-2 specific issues briefly, e.g., "Хорошо, но вместо 'hyvää' лучше 'hyvin' для точности."
        
        If the meaning doesn't match: State "Смысл не тот" and give a short suggestion on how to say it better, e.g., "Смысл не тот — попробуй: [brief correct phrasing]."

        Respond ONLY in Russian, in 2-3 sentences maximum. Keep feedback encouraging and concise.
      `;
    },
    getPromptInfo(fullDialogText, level) {
      if (!fullDialogText || fullDialogText.trim().length === 0) {
        return 'Недостаточно данных для анализа.';
      }
      return `
        You are a Finnish language expert specializing in linguistic analysis. Analyze the following dialogue in Finnish, assuming the user has a ${level} proficiency level.
        Provide a concise analysis in Russian, suitable for a learner at this level.
        Focus the analysis on the most interesting and non-obvious linguistic features, including:
           1.  **Interesting Vocabulary:** Identify unique or culturally specific words/phrases. Explain their meaning, usage, and why they are interesting for a learner.
           2.  **Grammatical Features:** Highlight notable grammatical structures, such as case usage, verb conjugations, or sentence structures. Explain their function and impact in simple terms.
        Do NOT include a long introductory sentence. Do NOT quote full sentences from the dialogue. Mention words or grammatical features and provide a brief explanation.
        Format the output strictly using Markdown headings and bullet points for readability.
        Dialogue: ${fullDialogText}
      `;
    },
    async checkUserTranslation(rusText, finText, level) {
      this.isLoading = true;
      this.geminiResult = '';
      try {
        const prompt = this.getPromptForTranslation(rusText, finText, level);
        this.geminiResult = await fetchGeminiResponse(prompt);
      } catch (error) {
        const errorMessage = i18n.global.t('store.trError');
        this.geminiResult = `<p>${errorMessage}</p>`;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
