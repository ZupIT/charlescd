const TraceLogger = (trace: any) => {
  return {
    fileName: trace.getFileName(),
    functionName: trace.getFunctionName(),
  }
}

export { TraceLogger }
