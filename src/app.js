
import { handleStartGame, handleStopGame, resetGame } from './game.js';

const tabs = {
	practice() {
		showView("practice");
	},

}

let currentTab = ""

function showView(tabName) {
	document.querySelectorAll(".tab-view").forEach(el => {
		el.style.display="none";
	})
	const view = document.getElementById(`view-${tabName}`);
	if (view) {
		view.style.display = "block";
        openPracticeTab();
	}
}

function tabChange() {
	const hash = window.location.hash.replace("#", "") || "practice";
	console.log(hash);
	if (hash !== currentTab) {
		currentTab = hash;
		if (tabs[hash]) {
			tabs[hash]();
		}
	}
}

window.addEventListener("hashchange", tabChange)
window.addEventListener("load", tabChange);

export function openPracticeTab() {
	const buttonStart = document.getElementById("startGame");
	const buttonStop = document.getElementById("stopGame");
	const gameOptions = document.getElementById("options");
	const stopOptions = document.getElementById("stop");
	resetGame();
	buttonStart.addEventListener("click", () => {
		const counter = parseInt(document.getElementById("ballCount").value);
		gameOptions.style.display = "none";
		stopOptions.style.display = "block";
		handleStartGame(counter);
	});
	buttonStop.addEventListener("click", () => {
		gameOptions.style.display = "flex";
		stopOptions.style.display = "none";
		handleStopGame();
	});
}

document.addEventListener("visibilitychange", () => {
	console.log("visibilityState is: ", document.visibilityState);
	if (document.visibilityState === "hidden") {
		console.log("Tab hidden – user switched or minimized");
	} else if (document.visibilityState === "visible") {
		console.log("Tab visible again");
	}
});