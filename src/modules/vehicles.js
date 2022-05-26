const logger = require('@mirasaki/logger');
const { colorResolver } = require('../util');

// Definitions
const MS_IN_TWO_WEEKS = 1000 * 60 * 60 * 24 * 14;
const PATH_TO_VEHICLE_CONFIG = '../../config/vehicles.json';
const vehicleConfig = require(PATH_TO_VEHICLE_CONFIG);

// Assign our final workable array
const finalVehicleArr =
  vehicleConfig.vehicles.map((vehicle) => {
    if (vehicle.variants?.length >= 1) {
      // Loop over all variants
      const vehicles = [ vehicle ];
      vehicle.variants.forEach((variant) => {
        // Creating and modifying new variant object
        const varObj = {
          // Defaults are base vehicle
          ...vehicle,
          // Spread every key defined in the variant
          // in our object
          // overwriting the base
          ...variant,
          // concat extra fields if applicable/conditionally
          fields: (
            vehicle.fields?.length >= 1
              ? variant.fields?.length >= 1
                ? vehicle.fields.concat(variant.fields)
                : vehicle.fields
              : variant.fields || []
          )
        };
          // Finishing up
        delete varObj.variants;
        delete vehicle.variants;
        // Including the variant entry
        vehicles.push(varObj);
      });

      // Return our concatenated vehicle arr
      return vehicles;
    }

    return vehicle;
  // Flat() is beautiful btw
  // it spreads each array into the main array
  }).flat();

// Get vehicle search results
const getVehicleQueryResult = (query) => {
  console.log(finalVehicleArr);
  let result = [];
  // Default query
  if (query === '') {
    result = finalVehicleArr.map((vehicle) => ({
      name: vehicle.name,
      value: vehicle.name
    })).sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }

  // Getting our search query's results
  const queryResult = finalVehicleArr.filter(
    (vehicle) =>
      // Filtering matches by name
      vehicle.name.toLowerCase().indexOf(query) >= 0
  );

  // Structuring our result for Discord's API
  result = queryResult
    .map(vehicle => ({
      name: vehicle.name,
      value: vehicle.name
    }))
    // Sorting alphabetically
    .sort((a, b) => a.name.localeCompare(b.name));

  return result;
};

// Grabs if from config, send embed for every single
// available vehicle in the defined channel if available
const updateVehicleChannel = async (client) => {
  // Definitions / Assignments
  const EMBEDS_PER_MESSAGE = 10;
  const channelId = vehicleConfig.vehicleChannelId;
  const isValidChannelId = /^[0-9]{18}$/g.test(channelId);
  if (!isValidChannelId) return true;
  const channel = await client.channels.fetch(channelId);

  // Check data availability
  if (!channel) {
    // Finished
    return true;
  }

  // Clean the channel from our old messages
  const timestampTwoWeeksAgo = Date.now() - MS_IN_TWO_WEEKS;
  try {
    await channel.bulkDelete(
      (await channel.messages.fetch({ limit: 100 }))
        .filter(
          (msg) => msg.author.id === client.user.id // Check client messages
          && msg.createdTimestamp > timestampTwoWeeksAgo // Check 2 weeks old - API limitation
        )
    );
  } catch (err) {
    // Properly log unexpected errors
    logger.syserr('Something went wrong while cleaning vehicle channel:');
    logger.printErr(err);
  }

  // Non destructive chunk slicing btw =)
  const embedBatchesOfTen = [];
  for (let i = 0; i < finalVehicleArr.length; i += EMBEDS_PER_MESSAGE) {
    embedBatchesOfTen.push(
      finalVehicleArr.slice(i, i + EMBEDS_PER_MESSAGE)
    );
  }

  // Send a separate message for every batch
  embedBatchesOfTen.forEach(async (batch) => {
    // Send channel to message with UP TO 10 embeds
    await channel.send({
      embeds: batch.map((vehicle) => buildVehicleEmbed(vehicle))
    });
  });
};

// Build our vehicle output/data embed
const buildVehicleEmbed = (targetVehicle) => {
  // Embed field data
  let fields = [];
  // Adding to field data conditionally
  if (typeof targetVehicle.speed !== 'undefined') {
    fields.push({
      name: 'Speed',
      value: `${targetVehicle.speed}`,
      inline: true
    });
  }
  if (typeof targetVehicle.acceleration !== 'undefined') {
    fields.push({
      name: 'Acceleration',
      value: `${targetVehicle.acceleration}`,
      inline: true
    });
  }
  if (typeof targetVehicle.handling !== 'undefined') {
    fields.push({
      name: 'Handling',
      value: `${targetVehicle.handling}`,
      inline: true
    });
  }

  // Storage slot field
  if (typeof targetVehicle.storageSlots !== 'undefined') {
    const storageStr = targetVehicle.storageSlots ? `${targetVehicle.storageSlots} slots` : 'Not specified';
    fields.push({
      name: 'Storage / Capacity',
      value: `${storageStr}`,
      inline: true
    });
  }

  // Seats slots
  if (typeof targetVehicle.seats !== 'undefined') {
    fields.push({
      name: 'Seats',
      value: `${targetVehicle.seats}`,
      inline: true
    });
  }

  // Price field
  if (typeof targetVehicle.price !== 'undefined') {
    fields.push({
      name: 'Price',
      value: `${targetVehicle.price}`,
      inline: true
    });
  }

  // Get rating string
  const ratingStr =
    typeof targetVehicle.rating !== 'undefined'
      ? `Rating: ${Array.from({
        length: Math.round(Number(targetVehicle.rating))
      }).map(() => '⭐').join('')}`
      : null;

  // Applying custom fields
  if (targetVehicle.fields?.length >= 1) {
    fields = fields.concat(targetVehicle.fields);
  }

  // Returning the embed data
  return ({
    color: colorResolver(),
    author: {
      name: targetVehicle.name,
      icon_url: targetVehicle.imageURL || null
    },
    description: targetVehicle.description || '\u200b',
    fields,
    image: {
      url: targetVehicle.imageURL || null
    },
    footer: { text: ratingStr }
  });
};

// Export our components
module.exports = {
  vehicles: vehicleConfig.vehicles,
  finalVehicleArr,
  updateVehicleChannel,
  buildVehicleEmbed,
  getVehicleQueryResult
};
