import React from 'react';

jest.mock('react-apexcharts', () => {
  return {
    __esModule: true,
    default: (props: any) => {
      const [serie] = props.series;
      const data = serie?.data && serie?.data?.length ? serie?.data : [];

      return (
        <div data-testid="apexcharts-mock" {...props}>
          <div>
            <svg>
              <g className="apexcharts-yaxis">
                <g>
                  {data.map((y: number[], index: number) => (
                    <text
                      key={`y-${index}`}
                      className="apexcharts-yaxis-label"
                    >
                      { y[1] }
                    </text>
                  ))}
                </g>
              </g>
              <g className="apexcharts-xaxis">
                <g>
                  {data.map((x: number[], index: number) => (
                    <text
                      key={`x-${index}`}
                      className="apexcharts-xaxis-label"
                    >
                      { x[0] }
                    </text>
                  ))}
                </g>
              </g>
            </svg>
          </div>
        </div>
      );
    }
  };
});
