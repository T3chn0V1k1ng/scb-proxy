app.post("/scb/companies", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.scb.se/OV0104/v1/doris/en/ssd/BE/BE0101/BE0101A/Foretagsregister"
    );

    const data = await response.json();

    res.json({
      success: true,
      source: "SCB",
      data: data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SCB fetch failed" });
  }
});
