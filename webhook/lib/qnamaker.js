const request = require('request');

class QnA {
    constructor(serviceGuid,subscriptionKey,
                host='https://westus.api.cognitive.microsoft.com/qnamaker/v2.0') {
        this.serviceGuid = serviceGuid;
        this.subscriptionKey = subscriptionKey;
        this.host = host;

        if (!host.startsWith('http') || !host.includes('qnamaker')) {
            throw new Error('Error with host parameters, go to qnamaker for more information.')
        }
    }

    getRawAnswer(question) {
        return new Promise((resolve, reject) => {
          let url = `${this.host}/knowledgebases/${this.serviceGuid}/generateAnswer`;
          request.post(
            // Request params:
            {
              url: url,
              method: 'POST',
              json: true,
              body: {
                question: question,
              },
              headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': this.subscriptionKey,
              },
            },
    
            // Callback:
            (error, response, body) => {
              if (error) reject(error);
              resolve(body);
            }
          );
        });
      }

    async answer(question) {
        let rawData = await this.getRawAnswer(question);
        if (rawData && rawData.answers && rawData.answers[0]) {
            return rawData;    
        } else {
           // console.log(rawData);
            throw new Error('Invalid answer received from QnA server.');
        }
    }

    
}

QnA.FAILED_ANSWER = 'No good match found in the KB';

module.exports = QnA;