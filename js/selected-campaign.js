(function () {
  "use strict";

  var target = document.getElementById("featured-campaign");
  if (!target) return;

  fetch("data/campaign-inventory.json", { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) throw new Error("Inventory request failed");
      return response.json();
    })
    .then(function (inventory) {
      var record = (inventory.campaignRecords || []).find(function (item) {
        return item.featured && item.caseStudyStatus !== "duplicate";
      });
      if (!record) {
        target.remove();
        return;
      }

      target.replaceChildren();
      target.setAttribute("aria-busy", "false");
      var copy = document.createElement("div");
      copy.className = "campaign-feature-copy";
      var label = document.createElement("span");
      var title = document.createElement("h4");
      var quote = document.createElement("blockquote");
      var attribution = document.createElement("p");
      var link = document.createElement("a");
      var testimonial = (record.relatedTestimonials || [])[0];

      label.className = "case-kicker";
      label.textContent = (record.caseStudyStatus === "partial" ? "Documented campaign record" : "Campaign showcase") + " · " + (record.category || record.industry || "");
      title.textContent = record.title;
      copy.append(label, title);
      var metrics = (record.metrics || []).filter(function (metric) { return metric.label && metric.value; });
      if (metrics.length) {
        var metricsLabel = document.createElement("p");
        metricsLabel.className = "feature-evidence-label";
        metricsLabel.textContent = "Documented campaign metrics";
        var metricGrid = document.createElement("div");
        metricGrid.className = "campaign-feature-metrics";
        metrics.forEach(function (metric) {
          var item = document.createElement("div");
          item.className = "campaign-feature-metric" + (metric.label === record.primaryMetric ? " campaign-feature-metric-primary" : "");
          var value = document.createElement("strong");
          value.textContent = metric.value;
          var metricName = document.createElement("span");
          metricName.textContent = metric.label;
          item.append(value, metricName);
          metricGrid.appendChild(item);
        });
        copy.append(metricsLabel, metricGrid);
      }
      if (testimonial) {
        var testimonialLabel = document.createElement("p");
        testimonialLabel.className = "feature-evidence-label";
        testimonialLabel.textContent = "Related client feedback";
        quote.textContent = testimonial.quote;
        attribution.textContent = [testimonial.author, testimonial.role].filter(Boolean).join(" · ");
        copy.append(testimonialLabel, quote, attribution);
      }
      if (!record.dateRange || !record.metricContext) {
        var contextNote = document.createElement("p");
        contextNote.className = "campaign-feature-note";
        contextNote.textContent = "Reporting period and attribution are not stated in the available portfolio record.";
        copy.appendChild(contextNote);
      }
      link.href = "case-study.html?id=" + encodeURIComponent(record.id);
      link.className = "text-link";
      link.textContent = record.caseStudyStatus === "full" ? "Read full case study" : "View campaign record";
      target.append(copy, link);
    })
    .catch(function () { target.remove(); });
})();
