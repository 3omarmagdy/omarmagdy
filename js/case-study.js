(function () {
  "use strict";
  var params = new URLSearchParams(window.location.search);
  var requestedId = params.get("id");
  var article = document.getElementById("campaign-record");
  var title = document.getElementById("record-title");
  function fail(message) {
    title.textContent = message;
    document.getElementById("record-intro").textContent = "Return to the campaign portfolio to browse available records.";
    document.getElementById("record-type").textContent = "Record unavailable";
    article.setAttribute("data-state", "unavailable");
  }
  function addTextSection(container, heading, value) {
    if (!value) return;
    var section = document.createElement("section");
    section.className = "case-detail-section";
    var h = document.createElement("h2");
    h.textContent = heading;
    var p = document.createElement("p");
    p.textContent = value;
    section.appendChild(h);
    section.appendChild(p);
    container.appendChild(section);
  }
  fetch("data/campaign-inventory.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Inventory unavailable");
      return response.json();
    })
    .then(function (inventory) {
      var records = inventory.campaignRecords || [];
      var record = records.find(function (item) { return item.id === requestedId; });
      if (!record || (record.caseStudyStatus !== "partial" && record.caseStudyStatus !== "full")) {
        fail("Campaign record not found.");
        return;
      }
      document.title = record.title + " | Omar Magdy";
      document.getElementById("record-type").textContent =
        record.caseStudyStatus === "full" ? "Full case study" : "Documented campaign record";
      title.textContent = record.title;
      document.getElementById("record-industry").textContent = record.industry || "";
      document.getElementById("record-intro").textContent = record.shortDescription || "";
      var tags = document.getElementById("record-tags");
      [record.objective, record.platform, record.market].filter(Boolean).forEach(function (value) {
        var chip = document.createElement("span");
        chip.textContent = value;
        tags.appendChild(chip);
      });

      if (record.metrics && record.metrics.length) {
        var grid = document.getElementById("metric-grid");
        record.metrics.forEach(function (metric) {
          var item = document.createElement("article");
          item.className = "metric-card";
          var value = document.createElement("strong");
          value.textContent = metric.value;
          var label = document.createElement("span");
          label.textContent = metric.label + (metric.context ? " · " + metric.context : "");
          item.appendChild(value);
          item.appendChild(label);
          grid.appendChild(item);
        });
        document.getElementById("metrics-section").hidden = false;
      }

      if (record.relatedTestimonials && record.relatedTestimonials.length) {
        var testimonial = record.relatedTestimonials[0];
        document.getElementById("testimonial-quote").textContent = testimonial.quote;
        document.getElementById("testimonial-attribution").textContent =
          [testimonial.author, testimonial.role].filter(Boolean).join(" · ");
        document.getElementById("testimonial-section").hidden = false;
      }

      var optional = document.getElementById("optional-sections");
      [
        ["businessContext", "Business context"],
        ["challenge", "Challenge"],
        ["diagnosis", "Diagnosis"],
        ["audienceStrategy", "Audience"],
        ["creativeStrategy", "Creative strategy"],
        ["funnelStrategy", "Funnel"],
        ["campaignStructure", "Campaign structure"],
        ["execution", "Execution"],
        ["optimization", "Optimization"],
        ["learnings", "Learnings"]
      ].forEach(function (entry) {
        addTextSection(optional, entry[1], record[entry[0]]);
      });
      if (record.objective) addTextSection(optional, "Objective", record.objective);

      document.querySelector(".back-link").href = "portfolio.html#" + record.id;
      var candidates = records.filter(function (item) {
        return (item.caseStudyStatus === "partial" || item.caseStudyStatus === "full") && item.title;
      });
      var index = candidates.findIndex(function (item) { return item.id === record.id; });
      if (index >= 0 && candidates.length > 1) {
        var previous = candidates[(index - 1 + candidates.length) % candidates.length];
        var next = candidates[(index + 1) % candidates.length];
        var prevLink = document.getElementById("previous-record");
        var nextLink = document.getElementById("next-record");
        prevLink.href = "case-study.html?id=" + encodeURIComponent(previous.id);
        prevLink.textContent = "← " + previous.title;
        nextLink.href = "case-study.html?id=" + encodeURIComponent(next.id);
        nextLink.textContent = next.title + " →";
      } else {
        document.querySelector(".record-pagination").hidden = true;
      }
      article.setAttribute("data-state", record.caseStudyStatus || "showcase");
      if (record.caseStudyStatus === "partial") { var note=document.createElement("p"); note.className="source-note"; note.textContent="This is a documented campaign record, not a full case study."; document.getElementById("optional-sections").appendChild(note); }
      var desc=document.querySelector("meta[name=description]"); if(desc) desc.content=record.title+" — documented campaign record from Omar Magdy’s performance marketing portfolio.";
      var og=document.querySelector('meta[property=\"og:title\"]'); if(og) og.content=record.title+" | Omar Magdy";
    })
    .catch(function (error) {
      console.error("Campaign record render failed:", error);
      fail("Campaign record could not be loaded.");
    });
})();
