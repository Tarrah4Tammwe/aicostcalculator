(function (factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (typeof document !== "undefined") api.mount();
})(function () {
  const PRICE_DATE = "26 September 2026";

  const MODELS = [
    { id: "luna", name: "GPT-6 Luna", provider: "OpenAI", tier: "Budget", ctx: "1M", input: 0.1, cached: 0.01, output: 0.5, batch: 0.5, long: { threshold: 272000, input: 0.2, cached: 0.02, output: 0.75 }, source: "https://developers.openai.com/api/docs/pricing", sourceName: "OpenAI API pricing" },
    { id: "sol", name: "GPT-6 Sol", provider: "OpenAI", tier: "Mid", ctx: "1M", input: 2, cached: 0.2, output: 10, batch: 0.5, long: { threshold: 272000, input: 4, cached: 0.4, output: 15 }, source: "https://developers.openai.com/api/docs/pricing", sourceName: "OpenAI API pricing" },
    { id: "astra", name: "GPT-6 Astra", provider: "OpenAI", tier: "Flagship", ctx: "1M", input: 10, cached: 1, output: 50, batch: 0.5, long: { threshold: 272000, input: 20, cached: 2, output: 75 }, source: "https://developers.openai.com/api/docs/pricing", sourceName: "OpenAI API pricing" },
    { id: "haiku", name: "Claude Haiku 4.5", provider: "Anthropic", tier: "Budget", ctx: "200K", input: 1, cached: 0.1, output: 5, batch: 0.5, source: "https://docs.anthropic.com/en/docs/about-claude/models/overview", sourceName: "Anthropic models overview" },
    { id: "sonnet", name: "Claude Sonnet 5", provider: "Anthropic", tier: "Mid", ctx: "1M", input: 2, cached: 0.2, output: 10, batch: 0.5, source: "https://www.anthropic.com/news/claude-sonnet-5", sourceName: "Claude Sonnet 5" },
    { id: "opus", name: "Claude Opus 5.5", provider: "Anthropic", tier: "Flagship", ctx: "1M", input: 4, cached: 0.2, output: 20, batch: 0.5, source: "https://www.anthropic.com/claude-opus-5-5", sourceName: "Claude Opus 5.5" },
    { id: "fable", name: "Claude Fable 5.1", provider: "Anthropic", tier: "Specialist", ctx: "1M", input: 10, cached: 0.25, output: 50, batch: 0.5, source: "https://docs.anthropic.com/en/docs/about-claude/models/overview", sourceName: "Anthropic models overview" },
    { id: "flash-lite", name: "Gemini 3.1 Flash-Lite", provider: "Google", tier: "Budget", ctx: "1M", input: 0.25, cached: 0.025, output: 1.5, batch: 0.5, note: "Text, image, and video input. Audio input is twice the text rate and is not applied here. Output includes thinking tokens.", source: "https://ai.google.dev/gemini-api/docs/pricing", sourceName: "Gemini API pricing" },
    { id: "g35", name: "Gemini 3.5 Flash", provider: "Google", tier: "Mid", ctx: "1M", input: 1.5, cached: 0.15, output: 9, batch: 0.5, note: "Output price includes thinking tokens.", source: "https://ai.google.dev/gemini-api/docs/pricing", sourceName: "Gemini API pricing" },
    { id: "gpro", name: "Gemini 3.1 Pro", provider: "Google", tier: "Preview", ctx: "1M", input: 2, cached: 0.2, output: 12, batch: 0.5, long: { threshold: 200000, input: 4, cached: 0.4, output: 18 }, note: "Preview model. Output includes thinking tokens.", source: "https://ai.google.dev/gemini-api/docs/pricing", sourceName: "Gemini API pricing" },
    { id: "grok43", name: "Grok 4.3", provider: "xAI", tier: "Mid", ctx: "1M", input: 1.25, cached: 0.2, output: 2.5, batch: 1, long: { threshold: 200000, input: 2.5, cached: 0.4, output: 5 }, batchNote: "xAI has not published a batch discount for this model, so batch mode keeps the standard rate.", source: "https://docs.x.ai/developers/pricing", sourceName: "xAI API pricing" },
    { id: "grok46", name: "Grok 4.6", provider: "xAI", tier: "Mid", ctx: "500K", input: 2, cached: 0.5, output: 6, batch: 1, long: { threshold: 200000, input: 4, cached: 1, output: 12 }, batchNote: "xAI has not published a batch discount for this model, so batch mode keeps the standard rate.", source: "https://docs.x.ai/developers/pricing", sourceName: "xAI API pricing" },
    { id: "grokbuild", name: "Grok Build 0.1", provider: "xAI", tier: "Code", ctx: "256K", input: 1, cached: 0.2, output: 2, batch: 1, long: { threshold: 200000, input: 2, cached: 0.4, output: 4 }, batchNote: "Early-access coding model. xAI has not published a batch discount, so batch mode keeps the standard rate.", source: "https://docs.x.ai/developers/pricing", sourceName: "xAI API pricing" },
    { id: "dsflash", name: "DeepSeek V4.1 Flash", provider: "DeepSeek", tier: "Budget", ctx: "1M", input: 0.3, cached: 0.006, output: 1.2, batch: 1, rateLabel: "Peak", batchNote: "DeepSeek lists peak and off-peak rates instead of a batch tier. This estimate uses the peak rate. Off-peak is half.", source: "https://api-docs.deepseek.com/quick_start/pricing", sourceName: "DeepSeek API pricing" },
    { id: "dspro", name: "DeepSeek V4 Pro", provider: "DeepSeek", tier: "Mid", ctx: "1M", input: 1.32, cached: 0.044, output: 3.96, batch: 1, rateLabel: "Peak", batchNote: "DeepSeek lists peak and off-peak rates instead of a batch tier. This estimate uses the peak rate. Off-peak is half.", source: "https://api-docs.deepseek.com/quick_start/pricing", sourceName: "DeepSeek API pricing" }
  ];

  const PRESETS = {
    chatbot: { requests: 50000, input: 800, output: 250 },
    docs: { requests: 4000, input: 12000, output: 700 },
    code: { requests: 8000, input: 6000, output: 1800 },
    rag: { requests: 100000, input: 2500, output: 350 },
    classify: { requests: 500000, input: 180, output: 24 }
  };

  function ratesFor(model, options) {
    const useLong = Boolean(options.long && model.long);
    const base = useLong ? model.long : model;
    const factor = options.batch ? model.batch : 1;
    return {
      input: base.input * factor,
      cached: base.cached * factor,
      output: base.output * factor,
      discounted: factor !== 1,
      longApplied: useLong
    };
  }

  function estimate(model, workload) {
    const rates = ratesFor(model, workload);
    const inputTokens = workload.requests * workload.input;
    const outputTokens = workload.requests * workload.output;
    const cachedTokens = inputTokens * workload.cache;
    const freshTokens = inputTokens - cachedTokens;
    const inputCost = (freshTokens / 1e6) * rates.input + (cachedTokens / 1e6) * rates.cached;
    const outputCost = (outputTokens / 1e6) * rates.output;
    const cacheSavings = (cachedTokens / 1e6) * (rates.input - rates.cached);
    return {
      rates,
      inputTokens,
      outputTokens,
      inputCost,
      outputCost,
      cacheSavings,
      total: inputCost + outputCost
    };
  }

  function money(n) {
    if (!isFinite(n)) return "—";
    const sign = n < 0 ? "-" : "";
    const abs = Math.abs(n);
    const digits = abs >= 1 ? 2 : abs >= 0.01 ? 4 : 6;
    return sign + "$" + abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: digits });
  }

  function rateText(n) {
    if (n >= 1) return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const trimmed = n.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
    const decimals = trimmed.includes(".") ? trimmed.split(".")[1].length : 0;
    return "$" + (decimals < 2 ? n.toFixed(2) : trimmed);
  }

  function tokens(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "k";
    return String(Math.round(n));
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function mount() {
    const form = document.getElementById("calc-form");
    if (!form) return;

    const req = document.getElementById("requests");
    const reqRange = document.getElementById("requests-range");
    const inp = document.getElementById("input-tokens");
    const inpRange = document.getElementById("input-range");
    const out = document.getElementById("output-tokens");
    const outRange = document.getElementById("output-range");
    const cache = document.getElementById("cache");
    const cacheOut = document.getElementById("cache-out");
    const longBox = document.getElementById("long-context");
    const longNote = document.getElementById("long-note");
    const preset = document.getElementById("preset");
    const modelList = document.getElementById("model-list");
    const chips = document.getElementById("provider-chips");
    const compare = document.getElementById("compare");
    const live = document.getElementById("live-summary");

    let selected = "sol";
    let provider = "All";
    let shareUrl = false;

    const params = new URLSearchParams(location.search);
    if (MODELS.some(function (m) { return m.id === params.get("model"); })) selected = params.get("model");
    setNum(req, params.get("requests"), 1, 20000000);
    setNum(inp, params.get("input"), 1, 1000000);
    setNum(out, params.get("output"), 1, 200000);
    if (params.has("cache")) cache.value = String(clamp(Number(params.get("cache")) || 0, 0, 100));
    if (params.get("mode") === "batch") form.elements.mode.value = "batch";
    longBox.checked = params.get("long") === "1";
    shareUrl = params.toString().length > 0;

    function workload() {
      return {
        requests: positive(req.value, 10000),
        input: positive(inp.value, 500),
        output: positive(out.value, 300),
        cache: clamp(Number(cache.value) || 0, 0, 100) / 100,
        batch: form.elements.mode.value === "batch",
        long: longBox.checked
      };
    }

    function current() {
      return MODELS.find(function (m) { return m.id === selected; });
    }

    function renderModels() {
      const visible = MODELS.filter(function (m) { return provider === "All" || m.provider === provider; });
      modelList.innerHTML = visible.map(function (m) {
        const label = m.rateLabel ? " " + m.rateLabel.toLowerCase() : "";
        return '<button type="button" class="model-btn" data-id="' + m.id + '" aria-pressed="' + (m.id === selected) + '">' +
          "<strong>" + esc(m.name) + "</strong>" +
          '<span class="meta">' + esc(m.provider) + " · " + esc(m.tier) + " · " + esc(m.ctx) + "</span>" +
          '<span class="price">' + rateText(m.input) + " / " + rateText(m.output) + label + "</span>" +
          "</button>";
      }).join("");
    }

    function render() {
      const model = current();
      const work = workload();
      const result = estimate(model, work);
      cacheOut.textContent = Math.round(work.cache * 100) + "%";
      syncRange(req, reqRange, 100, 5000000);
      syncRange(inp, inpRange, 50, 200000);
      syncRange(out, outRange, 16, 32000);

      document.getElementById("cost-num").textContent = money(result.total);
      document.getElementById("cost-model").textContent = model.name + (model.rateLabel ? " · " + model.rateLabel.toLowerCase() + " rate" : "");
      document.getElementById("cost-period").textContent = work.requests.toLocaleString("en-US") + " requests / month";
      document.getElementById("bk-in-tok").textContent = tokens(result.inputTokens);
      document.getElementById("bk-out-tok").textContent = tokens(result.outputTokens);
      document.getElementById("bk-in").textContent = money(result.inputCost);
      document.getElementById("bk-out").textContent = money(result.outputCost);
      document.getElementById("bk-cache").textContent = result.cacheSavings > 0 ? "−" + money(result.cacheSavings) : "None";
      document.getElementById("bk-each").textContent = money(result.total / work.requests);
      document.getElementById("bk-thousand").textContent = money((result.total / work.requests) * 1000);
      document.getElementById("bk-year").textContent = money(result.total * 12);

      const notes = [];
      if (work.long && model.long) notes.push("Long-context rate applied for prompts over " + tokens(model.long.threshold) + " input tokens. Providers charge that higher rate on the whole request.");
      else if (work.long) notes.push("This model publishes one rate across its " + model.ctx + " context window.");
      else if (model.long) notes.push("Short-context rate. Turn on long context if a prompt passes " + tokens(model.long.threshold) + " input tokens.");
      if (work.batch && model.batchNote) notes.push(model.batchNote);
      else if (work.batch) notes.push("Batch discount applied at 50% of the selected tier.");
      if (model.note) notes.push(model.note);
      longNote.textContent = notes.join(" ");

      const source = document.getElementById("rate-source");
      source.href = model.source;
      source.textContent = model.sourceName;

      const ranked = MODELS.map(function (m) {
        return { model: m, total: estimate(m, work).total };
      }).sort(function (a, b) { return a.total - b.total; });
      const max = ranked[ranked.length - 1].total || 1;
      const cheapest = ranked[0];

      compare.innerHTML = ranked.map(function (row, index) {
        const cls = ["compare-row", row.model.id === selected ? "is-selected" : "", index === 0 ? "is-cheap" : ""].filter(Boolean).join(" ");
        const tag = index === 0 ? '<span class="tag">lowest</span>' : (row.model.id === selected ? '<span class="tag hot">selected</span>' : "");
        return '<button type="button" class="' + cls + '" data-id="' + row.model.id + '">' +
          "<span><strong>" + esc(row.model.name) + "</strong>" + tag + "<small>" + esc(row.model.provider) + "</small></span>" +
          '<span class="bar" aria-hidden="true"><span style="width:' + Math.max(2, (row.total / max) * 100).toFixed(1) + '%"></span></span>' +
          '<span class="amt">' + money(row.total) + "</span></button>";
      }).join("");

      const banner = document.getElementById("save-banner");
      if (cheapest.model.id !== selected && cheapest.total < result.total) {
        const saved = result.total - cheapest.total;
        banner.hidden = false;
        banner.innerHTML = esc(cheapest.model.name) + " is " + esc(money(saved)) + " lower on this workload. <button type=\"button\" data-id=\"" + cheapest.model.id + "\">Use it</button>";
      } else banner.hidden = true;

      const summary = model.name + " estimate " + money(result.total) + " per month for " + work.requests.toLocaleString("en-US") + " requests.";
      form.dataset.summary = summary;

      if (!shareUrl) return;
      const url = new URL(location.href);
      url.search = "";
      url.searchParams.set("model", selected);
      url.searchParams.set("requests", String(work.requests));
      url.searchParams.set("input", String(work.input));
      url.searchParams.set("output", String(work.output));
      if (work.cache) url.searchParams.set("cache", String(Math.round(work.cache * 100)));
      if (work.batch) url.searchParams.set("mode", "batch");
      if (work.long) url.searchParams.set("long", "1");
      history.replaceState(null, "", url);
    }

    function choose(id) {
      selected = id;
      shareUrl = true;
      renderModels();
      render();
      announce();
    }

    function announce() {
      live.textContent = form.dataset.summary || "";
    }

    chips.addEventListener("click", function (event) {
      const button = event.target.closest("button");
      if (!button) return;
      provider = button.dataset.provider;
      chips.querySelectorAll("button").forEach(function (el) {
        el.setAttribute("aria-pressed", String(el === button));
      });
      renderModels();
    });

    modelList.addEventListener("click", function (event) {
      const button = event.target.closest("button");
      if (button) choose(button.dataset.id);
    });

    compare.addEventListener("click", function (event) {
      const button = event.target.closest("button");
      if (button) choose(button.dataset.id);
    });

    document.getElementById("save-banner").addEventListener("click", function (event) {
      const button = event.target.closest("button");
      if (button) choose(button.dataset.id);
    });

    form.addEventListener("input", function () { shareUrl = true; render(); });
    form.addEventListener("change", announce);
    form.addEventListener("submit", function (event) { event.preventDefault(); });

    preset.addEventListener("change", function () {
      const next = PRESETS[preset.value];
      if (!next) return;
      shareUrl = true;
      req.value = String(next.requests);
      inp.value = String(next.input);
      out.value = String(next.output);
      render();
      announce();
    });

    bindRange(reqRange, req, 100, 5000000);
    bindRange(inpRange, inp, 50, 200000);
    bindRange(outRange, out, 16, 32000);

    document.getElementById("copy-estimate").addEventListener("click", function () {
      const model = current();
      const work = workload();
      const result = estimate(model, work);
      const text = [
        model.name + " — " + money(result.total) + " / month",
        work.requests.toLocaleString("en-US") + " requests, " + work.input.toLocaleString("en-US") + " input tokens, " + work.output.toLocaleString("en-US") + " output tokens",
        (work.batch ? "Batch" : "Standard") + " · cache " + Math.round(work.cache * 100) + "%" + (result.rates.longApplied ? " · long context" : ""),
        "Input " + money(result.inputCost) + " · output " + money(result.outputCost) + " · year " + money(result.total * 12),
        "Rates checked " + PRICE_DATE + " · https://aicostcalculator.dev"
      ].join("\n");
      const button = document.getElementById("copy-estimate");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          button.textContent = "Copied";
          setTimeout(function () { button.textContent = "Copy estimate"; }, 1600);
        });
      }
    });

    renderModels();
    render();
  }

  function positive(value, fallback) {
    const n = Math.round(Number(value));
    return n > 0 ? n : fallback;
  }

  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

  function setNum(input, raw, min, max) {
    const n = Math.round(Number(raw));
    if (n >= min && n <= max) input.value = String(n);
  }

  function fromSlider(pos, min, max) {
    const t = Number(pos) / 1000;
    return Math.round(Math.exp(Math.log(min) + t * (Math.log(max) - Math.log(min))));
  }

  function toSlider(value, min, max) {
    const v = clamp(value, min, max);
    const t = (Math.log(v) - Math.log(min)) / (Math.log(max) - Math.log(min));
    return Math.round(t * 1000);
  }

  function syncRange(input, range, min, max) {
    range.value = String(toSlider(positive(input.value, min), min, max));
  }

  function bindRange(range, input, min, max) {
    range.addEventListener("input", function () {
      input.value = String(fromSlider(range.value, min, max));
    });
  }

  return { MODELS, estimate, money, rateText, PRICE_DATE, mount };
});
