(function () {
  "use strict";

  var catalog = document.getElementById("campaign-catalog");
  var search = document.getElementById("campaign-search");
  var categoryFilter = document.getElementById("industry-filter");
  var metricFilter = document.getElementById("objective-filter");
  var typeFilter = document.getElementById("record-type-filter");
  var featuredFilter = document.getElementById("featured-filter");
  var clearFilters = document.getElementById("clear-campaign-filters");
  var count = document.getElementById("campaign-count");
  var statusLabels = {
    full: "Full case study",
    partial: "Documented campaign record",
    showcase: "Campaign Showcase"
  };

  function createElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text != null) element.textContent = text;
    return element;
  }

  function normalizeSearchText(value) {
    return String(value || "").toLocaleLowerCase().replace(/\s+/g, " ").trim();
  }

  function addOption(select, value, label) {
    var option = createElement("option", "", label);
    option.value = value;
    select.appendChild(option);
  }

  function showLoadError() {
    catalog.replaceChildren(createElement("p", "catalog-state", "Campaign data could not be loaded."));
    catalog.setAttribute("aria-busy", "false");
    count.textContent = "Portfolio records are unavailable.";
  }

  function render(inventory) {
    if (!inventory || !Array.isArray(inventory.campaignRecords)) { showLoadError(); return; }

    // Exclude legacy duplicates defensively before filtering public campaign records.
    var records = (inventory.campaignRecords || []).filter(function (record) {
      return record.caseStudyStatus !== "duplicate" && record.caseStudyStatus !== "project";
    });
    var recordsById = new Map(records.map(function (record) { return [record.id, record]; }));

    Array.from(new Set(records.map(function (record) { return record.category || record.industry; }).filter(Boolean)))
      .sort()
      .forEach(function (value) { addOption(categoryFilter, normalizeSearchText(value), value); });

    Array.from(new Set(records.map(function (record) { return record.primaryMetric; }).filter(Boolean)))
      .sort()
      .forEach(function (value) { addOption(metricFilter, normalizeSearchText(value), value); });

    Array.from(new Set(records.map(function (record) { return record.caseStudyStatus; })))
      .sort()
      .forEach(function (value) { addOption(typeFilter, value, statusLabels[value] || value); });

    if (records.some(function (record) { return record.featured; })) {
      addOption(featuredFilter, "true", "Featured selections");
    }

    catalog.replaceChildren();
    var groups = new Map();
    records.forEach(function (record) {
      var category = record.category || record.industry || "Other records";
      if (!groups.has(category)) {
        var section = createElement("section", "category-block");
        section.setAttribute("aria-label", category);
        section.appendChild(createElement("h3", "category-heading", category));
        section.appendChild(createElement("div", "results-grid"));
        groups.set(category, section);
        catalog.appendChild(section);
      }

      var card = createElement("article", "result-card");
      card.id = record.id;
      card.dataset.category = normalizeSearchText(category);
      card.dataset.featured = record.featured ? "true" : "false";

      if (record.image) {
        var image = createElement("img", "result-image");
        image.src = record.image;
        image.alt = record.imageAlt || record.title || "Campaign visual";
        image.loading = "lazy";
        image.onerror = function () { image.remove(); };
        card.appendChild(image);
      }

      card.appendChild(createElement("h4", "result-title", record.title || "Untitled portfolio record"));
      card.appendChild(createElement("p", "result-industry", record.industry || category));
      if (record.objective && record.verificationStatus === "verified") {
        card.appendChild(createElement("p", "result-objective", record.objective));
      }

      var metrics = (record.metrics || []).filter(function (metric) { return metric.label && metric.value; });
      if (metrics.length) {
        var metricList = createElement("div", "result-metrics");
        metrics.forEach(function (metric) {
          var isPrimaryMetric = metric.label === record.primaryMetric;
          var row = createElement("div", "result-metric" + (isPrimaryMetric ? " result-metric-primary" : ""));
          var label = createElement("span", "lbl", metric.label);
          if (isPrimaryMetric) label.appendChild(createElement("span", "metric-priority", "Primary"));
          row.appendChild(label);
          row.appendChild(createElement("span", "val", metric.value));
          metricList.appendChild(row);
        });
        card.appendChild(metricList);
      }

      if (record.shortDescription) card.appendChild(createElement("p", "result-description", record.shortDescription));
      if (record.strategySummary) card.appendChild(createElement("p", "result-strategy", record.strategySummary));

      var footer = createElement("div", "result-card-footer");
      footer.appendChild(createElement("span", "record-status", statusLabels[record.caseStudyStatus] || "Portfolio record"));
      if (record.featured) footer.appendChild(createElement("span", "featured-status", "Featured selection"));
      if (record.caseStudyStatus === "partial" || record.caseStudyStatus === "full") {
        var link = createElement("a", "record-link", record.caseStudyStatus === "full" ? "Read full case study" : "View campaign record");
        link.href = "case-study.html?id=" + encodeURIComponent(record.id);
        footer.appendChild(link);
      }
      card.appendChild(footer);
      groups.get(category).querySelector(".results-grid").appendChild(card);
    });

    var emptyState = createElement("p", "catalog-state", "No campaign records match these selections. Clear filters or try another term.");
    emptyState.id = "campaign-empty-state";
    emptyState.hidden = true;
    catalog.appendChild(emptyState);
    var cards = Array.from(catalog.querySelectorAll(".result-card"));

    function applyFilters() {
      var query = normalizeSearchText(search.value);
      var visibleCount = 0;
      cards.forEach(function (card) {
        var record = recordsById.get(card.id);
        var searchableText = normalizeSearchText([record.title, record.industry, record.category, record.shortDescription, record.strategySummary]
          .filter(Boolean).join(" "));
        var matches = (!query || searchableText.includes(query)) &&
          (!categoryFilter.value || card.dataset.category === categoryFilter.value) &&
          (!metricFilter.value || normalizeSearchText(record.primaryMetric) === metricFilter.value) &&
          (!typeFilter.value || record.caseStudyStatus === typeFilter.value) &&
          (!featuredFilter.value || card.dataset.featured === featuredFilter.value);
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      catalog.querySelectorAll(".category-block").forEach(function (section) {
        section.hidden = !section.querySelector(".result-card:not([hidden])");
      });
      emptyState.hidden = visibleCount > 0;
      count.textContent = visibleCount + (visibleCount === 1 ? " listed portfolio record" : " listed portfolio records");
    }

    clearFilters.addEventListener("click", function () {
      search.value = "";
      [categoryFilter, metricFilter, typeFilter, featuredFilter].forEach(function (control) { control.value = ""; });
      applyFilters();
    });
    [search, categoryFilter, metricFilter, typeFilter, featuredFilter].forEach(function (control) {
      control.addEventListener(control === search ? "input" : "change", applyFilters);
    });
    applyFilters();
    catalog.setAttribute("aria-busy", "false");
  }

  fetch("data/campaign-inventory.json", { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) throw new Error("Inventory request failed");
      return response.json();
    })
    .then(render)
    .catch(showLoadError);
})();
