if (timer) {
  clearInterval(timer);
}

document.removeEventListener("visibilitychange", switchPage);
