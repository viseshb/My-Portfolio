export const setProgress = (setLoading: (value: number) => void) => {
  let percent = 0;
  let interval = window.setInterval(() => {
    if (percent <= 50) {
      const randomIncrement = Math.round(Math.random() * 5);
      percent += randomIncrement;
      setLoading(percent);
      return;
    }

    window.clearInterval(interval);
    interval = window.setInterval(() => {
      percent += Math.round(Math.random());
      setLoading(percent);
      if (percent > 91) {
        window.clearInterval(interval);
      }
    }, 2000);
  }, 100);

  const clear = () => {
    window.clearInterval(interval);
    setLoading(100);
  };

  const loaded = () =>
    new Promise<number>((resolve) => {
      window.clearInterval(interval);
      interval = window.setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
          return;
        }

        resolve(percent);
        window.clearInterval(interval);
      }, 2);
    });

  return { loaded, clear };
};
