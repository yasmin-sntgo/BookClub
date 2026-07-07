import Svg, { Circle, Line, Path, Polyline } from "react-native-svg";

export function Icon({ name, color = "currentColor", size = 22, strokeWidth = 1.9, fill = "none" }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none"
  };
  const lineProps = {
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  if (name === "home") {
    return (
      <Svg {...props}>
        <Path {...lineProps} d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
      </Svg>
    );
  }

  if (name === "books") {
    return (
      <Svg {...props}>
        <Path {...lineProps} d="M4 4h5a3 3 0 0 1 3 3v15a3 3 0 0 0-3-3H4Z" />
        <Path {...lineProps} d="M20 4h-5a3 3 0 0 0-3 3v15a3 3 0 0 1 3-3h5Z" />
      </Svg>
    );
  }

  if (name === "plus") {
    return (
      <Svg {...props}>
        <Line {...lineProps} x1={12} y1={5} x2={12} y2={19} />
        <Line {...lineProps} x1={5} y1={12} x2={19} y2={12} />
      </Svg>
    );
  }

  if (name === "users") {
    return (
      <Svg {...props}>
        <Path {...lineProps} d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <Circle {...lineProps} cx={8.5} cy={7} r={4} />
        <Path {...lineProps} d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <Path {...lineProps} d="M16 3.13a4 4 0 0 1 0 7.75" />
      </Svg>
    );
  }

  if (name === "list") {
    return (
      <Svg {...props}>
        <Path {...lineProps} d="M8 6h13" />
        <Path {...lineProps} d="M8 12h13" />
        <Path {...lineProps} d="M8 18h13" />
        <Circle {...lineProps} cx={4} cy={6} r={1.2} />
        <Circle {...lineProps} cx={4} cy={12} r={1.2} />
        <Circle {...lineProps} cx={4} cy={18} r={1.2} />
      </Svg>
    );
  }

  if (name === "search") {
    return (
      <Svg {...props}>
        <Circle {...lineProps} cx={11} cy={11} r={7} />
        <Line {...lineProps} x1={16.5} y1={16.5} x2={21} y2={21} />
      </Svg>
    );
  }

  if (name === "bell") {
    return (
      <Svg {...props}>
        <Path {...lineProps} d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <Path {...lineProps} d="M13.7 21a2 2 0 0 1-3.4 0" />
      </Svg>
    );
  }

  if (name === "bookmark") {
    return (
      <Svg {...props}>
        <Path {...lineProps} d="M19 21 12 17 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
      </Svg>
    );
  }

  if (name === "lock") {
    return (
      <Svg {...props}>
        <Path {...lineProps} d="M7 11V8a5 5 0 0 1 10 0v3" />
        <Path {...lineProps} d="M6 11h12v10H6Z" />
      </Svg>
    );
  }

  if (name === "share") {
    return (
      <Svg {...props}>
        <Path {...lineProps} d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
        <Path {...lineProps} d="M16 6 12 2 8 6" />
        <Line {...lineProps} x1={12} y1={2} x2={12} y2={16} />
      </Svg>
    );
  }

  if (name === "user") {
    return (
      <Svg {...props}>
        <Path {...lineProps} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <Circle {...lineProps} cx={12} cy={7} r={4} />
      </Svg>
    );
  }

  if (name === "heart") {
    return (
      <Svg {...props} fill={fill}>
        <Path
          d="M20.8 4.6a5.4 5.4 0 0 0-7.7 0L12 5.7l-1.1-1.1a5.4 5.4 0 1 0-7.7 7.7l1.1 1.1L12 21l7.7-7.6 1.1-1.1a5.4 5.4 0 0 0 0-7.7Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === "comment") {
    return (
      <Svg {...props}>
        <Path {...lineProps} d="M21 15a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z" />
      </Svg>
    );
  }

  if (name === "more") {
    return (
      <Svg {...props} fill={color}>
        <Circle cx={5} cy={12} r={1.6} />
        <Circle cx={12} cy={12} r={1.6} />
        <Circle cx={19} cy={12} r={1.6} />
      </Svg>
    );
  }

  if (name === "back") {
    return (
      <Svg {...props}>
        <Polyline {...lineProps} points="15 18 9 12 15 6" />
      </Svg>
    );
  }

  if (name === "star") {
    return (
      <Svg {...props} fill={fill === "none" ? color : fill || color}>
        <Path d="M12 2 15.1 8.3 22 9.3l-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1Z" />
      </Svg>
    );
  }

  if (name === "starOutline") {
    return (
      <Svg {...props}>
        <Path
          d="M12 2 15.1 8.3 22 9.3l-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === "send") {
    return (
      <Svg {...props}>
        <Path {...lineProps} d="M22 2 11 13" />
        <Path {...lineProps} d="M22 2 15 22l-4-9-9-4Z" />
      </Svg>
    );
  }

  return (
    <Svg {...props}>
      <Polyline {...lineProps} points="9 18 15 12 9 6" />
    </Svg>
  );
}
