
class CollabaryApiClient {

    static getCreator(id, accessToken) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'https://api.collabary.com/influencer-profiles/' + id,
                type: 'GET',
                beforeSend : function( xhr ) {
                    xhr.setRequestHeader( 'Authorization', 'Bearer ' + accessToken );
                },
                success: (response) => {
                    resolve(response);
                },
                error: (err) => {
                    reject(err);
                }
            });
        });
    }

    static extractProfileId(url) {
        return url.replace(/\D/g,'');
    }

    static extractInstagramUserName(profile) {
        return this.getChannel(profile, 'instagram').user_name;
    }

    static extractInstagramFollowers(profile) {
        const metrics = this.extractInstagramMetrics(profile);
        const followers = metrics.find((metric) => {
            return metric.name == 'num_followers';
        });
        return this.__abbrNum(followers.value, { decimal: 1, separator: ',' });
    }

    static extractInstagramEngagement(profile) {
        const metrics = this.extractInstagramMetrics(profile);
        const engagement = metrics.find((metric) => {
            return metric.name == 'engagement';
        });
        return this.__getEngagementMetric(engagement.value);
    }

    static extractInstagramMetrics(profile) {
        return this.getChannel(profile, 'instagram').metrics;
    }

    static getChannelNames(profile) {
        const instagram = this.getChannel(profile, 'instagram');
        const youtube = this.getChannel(profile, 'youtube');
        const blog = this.getChannel(profile, 'blog');

        if(instagram && youtube && blog) {
            return 'Instagram, Youtube, Blog';
        } else if(instagram && youtube) {
            return 'Instagram, Youtube';
        } else if(instagram && blog) {
            return 'Instagram, Blog';
        } else if(youtube && blog) {
            return 'Youtube, Blog';
        } else if(instagram) {
            return 'Instagram';
        } else if(youtube) {
            return 'Youtube';
        } else if(blog) {
            return 'Blog';
        }
        return '';
    }

    static getChannel(profile, name) {
        const channel = profile.channels.find((channel) => {
            return channel.type == name;
        });
        return channel;
    }

    static isCollabaryProfilePage(url) {
        return url.startsWith('https://app.collabary.com/content-creator/profiles/');
    }

    static __getEngagementMetric(decimal) {
        let value = decimal * 100;
        value = Number(value.toFixed(1));
      
        if (value % 1 === 0) {
          return value.toFixed(0);
        }
        return this.__replaceDecimalWithComma(value, ',');
    }

    static __replaceDecimalWithComma(number, separator = ',') {
        return number ? number.toString().replace('.', separator) : 0;
    }

    static __abbrNum(number, options) {
        const defaultOptions = {
          // 2 decimal places => 100, 3 => 1000, etc
          decimal: 2,
          // Whether the k, m, b, t should be in upper case
          upperCase: true,
          // The seperator for number. Either . or ,
          separator: '.'
        };
        const mergedOptions = { ...defaultOptions, ...options };
      
        const decPlaces = Math.pow(10, mergedOptions.decimal);
        // Enumerate number abbreviations
        const abbrev = ['k', 'm', 'b', 't'];
        let roundedNumber = number;
      
        // Go through the array backwards, so we do the largest first
        for (let i = abbrev.length - 1; i >= 0; i--) {
          // Convert array index to "1000", "1000000", etc
          const size = Math.pow(10, (i + 1) * 3);
          // If the number is bigger or equal do the abbreviation
          if (size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            roundedNumber = Math.round(number * decPlaces / size) / decPlaces;
      
            // when appropriate, this rounds off the decimal (COLLAB-1954)
            if (String(roundedNumber).substr(1, 1) !== '.') {
              roundedNumber = Math.round(roundedNumber);
            }
      
            // Handle special case where we round up to the next abbreviation
            if ((roundedNumber == 1000) && (i < abbrev.length - 1)) {
              roundedNumber = 1;
              i++;
            }
            // Add the letter for the abbreviation
            roundedNumber += abbrev[i];
            // We are done... stop
            break;
          }
        }
        roundedNumber = this.__replaceDecimalWithComma(roundedNumber, mergedOptions.separator);
      
        // quick hack to prevent 'k' from being capitalized
        // per Hanna on 26 Oct 2017
        if (roundedNumber && roundedNumber.includes('k')) {
          return roundedNumber;
        }
      
        return roundedNumber && mergedOptions.upperCase ? roundedNumber.toUpperCase() : roundedNumber;
      }
      

}