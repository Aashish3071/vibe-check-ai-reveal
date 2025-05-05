                <div>
                  <h4 className="font-medium mb-2">Triggers:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {pattern.triggers.map((trigger, i) => (
                      <li key={i} className="text-sm">{trigger}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Impact:</h4>
                  <p className="text-sm">{pattern.impact}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Healing Strategies:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {pattern.healingStrategies.map((strategy, i) => (
                      <li key={i} className="text-sm">{strategy}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardHeader className="pb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <Brain className="text-white w-4 h-4" />
              </div>
              <CardTitle className="text-lg">Healing Progress</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Strengths:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.healingProgress.strengths.map((strength, index) => (
                    <li key={index} className="text-sm">{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Areas for Growth:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.healingProgress.areas_for_growth.map((area, index) => (
                    <li key={index} className="text-sm">{area}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Next Steps:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.healingProgress.next_steps.map((step, index) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardHeader className="pb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                <ArrowRight className="text-white w-4 h-4" />
              </div>
              <CardTitle className="text-lg">Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="list-disc pl-5 space-y-2">
                {results.insights.map((insight, index) => (
                  <li key={index} className="text-sm">{insight}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={clearResults}
              variant="outline"
              className="flex-1"
            >
              New Analysis
            </Button>

            <ShareDialog />
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistPatternRecognizer; 