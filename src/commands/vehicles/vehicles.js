// Importing
const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  MessageAttachment
} = require('discord.js');
const { finalVehicleArr, buildVehicleEmbed } = require('../../modules/vehicles');
const { colorResolver } = require('../../util');

module.exports = {
  // Defining our Discord API data
  data: {
    description: 'Browse available vehicles',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: 'search',
        description: 'Search/browse for available vehicles',
        autocomplete: true,
        required: true
      }
    ]
  },

  config: { globalCmd: true },

  // eslint-disable-next-line sonarjs/cognitive-complexity
  run: async ({ interaction }) => {
    // Destructuring and declaring
    const { options } = interaction;
    let query = options.get('search').value;
    const targetVehicle = finalVehicleArr.find(
      (vehicle) => vehicle.name === query
    );

    // No valid target vehicle found
    if (!targetVehicle) {
      const getQueryResultStart = process.hrtime();
      const files = [];
      // Get our full query result
      query &&= query.toLowerCase();
      const fullQueryResult = finalVehicleArr.filter(
        (vehicle) => vehicle.name.toLowerCase().indexOf(query) >= 0
      )
        .map((vehicle) => `• ${vehicle.name}`)
        .sort((a, b) => a.localeCompare(b))
        .join('\n');

      // Attach file if result too long
      if (fullQueryResult?.length > 4096) files.push(
        new MessageAttachment(Buffer.from(fullQueryResult), 'query-result.txt')
      );

      // Performance timer
      const getQueryResultEnd = (
        process.hrtime(getQueryResultStart)[0] * 1000
        + getQueryResultStart[1] / 1000000
      ).toFixed(2);

      // Replying to the interaction
      interaction.reply({
        embeds: [
          {
            color: colorResolver(),
            title: 'Vehicle Query Results',
            // Print description or empty if file is attached
            description: `${fullQueryResult ? (
              fullQueryResult.length >= 4096 ? '' : fullQueryResult
            ) : 'Nothing was found.'}`,
            files,
            footer: {
              text: `${fullQueryResult.length} vehicles in ${getQueryResultEnd} ms`
            }
          }
        ]
      });

      // Return - interaction was handled
      return;
    }


    // A valid vehicle was found / perfect match
    interaction.reply({
      embeds: [ buildVehicleEmbed(targetVehicle) ]
    });

  }
};
