class Visualiser {
  static drawNetwork(ctx, network) {
    const left = ctx.canvas.width * 0.1;
    const top = ctx.canvas.width * 0.2;
    const width = ctx.canvas.width - 2 * left;
    const height = ctx.canvas.height - 2 * top;

    const layerHeight = height / network.levels.length;
    for (let i = network.levels.length - 1; i >= 0; i--) {
      const y = utils.linearInterp(
        top,
        top + height,
        (network.levels.length - 1 - i) / network.levels.length
      );
      Visualiser.drawLevel(
        ctx,
        network.levels[i],
        left,
        y,
        width,
        layerHeight,
        i == network.levels.length - 1 ? ["🠉", "🠈", "🠊", "🠋"] : []
      );
    }
  }

  static drawLevel(ctx, level, left, top, width, height, outputLabels) {
    const right = left + width;
    const bottom = top + height;

    const nodeRadius = 18;

    const { inputs, outputs, weights, biases } = level;

    //drawing the line b/w each pair of node
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(
          utils.linearInterp(
            left,
            right,
            inputs.length === 1 ? 0.5 : i / (inputs.length - 1)
          ),
          bottom
        );
        ctx.lineTo(
          utils.linearInterp(
            left,
            right,
            outputs.length === 1 ? 0.5 : j / (outputs.length - 1)
          ),
          top
        );
        const value = weights[i][j];
        ctx.lineWidth = 2;
        ctx.strokeStyle = utils.getRGBA(value);
        ctx.stroke();
      }
    }
    // drawing the input layer
    for (let i = 0; i < inputs.length; i++) {
      const x = utils.linearInterp(
        left,
        right,
        inputs.length === 1 ? 0.5 : i / (inputs.length - 1)
      );

      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = utils.getRGBA(inputs[i]);
      ctx.fill();
    }

    // drawing the output layer
    for (let i = 0; i < outputs.length; i++) {
      const x = utils.linearInterp(
        left,
        right,
        outputs.length === 1 ? 0.5 : i / (outputs.length - 1)
      );

      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = utils.getRGBA(outputs[i]);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = utils.getRGBA(biases[i]);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputLabels[i]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.font = nodeRadius * 1.3 + "px Arial";
        ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.5);
        ctx.lineWidth = 0.5;
        ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.5);
      }
    }
  }
}
