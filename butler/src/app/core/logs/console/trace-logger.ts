const TraceLogger = (trace) => {
  return {
    fileName: trace.getFileName(),
    functionName: trace.getFunctionName(),
  }
}

export { TraceLogger }
