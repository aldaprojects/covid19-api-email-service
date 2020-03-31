import mongoose from 'mongoose';

export default class MongoDB {
    public static connect( url: string ) {
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);

        mongoose.connect(url,
        {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},
            (err) => {
                if( err ) throw err;
                console.log('Base de datos online');
            }
        );
    }
}
